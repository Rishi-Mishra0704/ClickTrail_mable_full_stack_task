package server

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/Rishi-Mishra0704/ClickTrail/api/utils"
	"github.com/gin-gonic/gin"
)

// Define your base ClickTrail event structure
type BaseEvent struct {
	EventType string    `json:"eventType"`
	Timestamp time.Time `json:"timestamp"`
	URL       string    `json:"url"`
	Referrer  string    `json:"referrer"`
	UserAgent string    `json:"userAgent"`
	SessionID string    `json:"sessionId"`
}

func (s *Server) TrackEventHandler(c *gin.Context) {
	var raw map[string]any

	if err := c.ShouldBindJSON(&raw); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	base := BaseEvent{
		EventType: utils.GetString(raw["eventType"]),
		Timestamp: utils.ParseTime(raw["timestamp"]),
		URL:       utils.GetString(raw["url"]),
		Referrer:  utils.GetString(raw["referrer"]),
		UserAgent: utils.GetString(raw["userAgent"]),
		SessionID: utils.GetString(raw["sessionId"]),
	}

	// Clean base fields from raw payload
	delete(raw, "eventType")
	delete(raw, "timestamp")
	delete(raw, "url")
	delete(raw, "referrer")
	delete(raw, "userAgent")
	delete(raw, "sessionId")
	raw["ip"] = c.ClientIP()
	// Marshal extra fields as JSON string
	metaBytes, err := json.Marshal(raw)
	if err != nil {
		metaBytes = []byte("{}")
	}

	// Insert into ClickHouse
	err = s.clickhouse.Exec(context.Background(), `
		INSERT INTO events (
			event_type, timestamp, url, referrer, user_agent, session_id, metadata
		) VALUES (?, ?, ?, ?, ?, ?, ?)`,
		base.EventType,
		base.Timestamp,
		base.URL,
		base.Referrer,
		base.UserAgent,
		base.SessionID,
		string(metaBytes),
	)
	if err != nil {
		log.Print(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err, "message": "Failed to add data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
func (s *Server) StatsHandler(c *gin.Context) {
	rows, err := s.clickhouse.Query(context.Background(), `
		SELECT
			event_type,
			toStartOfMinute(timestamp) AS minute,
			count(*) AS total
		FROM events
		GROUP BY event_type, minute
		ORDER BY minute DESC
		LIMIT 100
	`)
	if err != nil {
		log.Println("stats query failed:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to query stats"})
		return
	}

	type Stat struct {
		EventType string    `json:"eventType"`
		Minute    time.Time `json:"minute"`
		Count     uint64    `json:"count"`
	}

	var stats []Stat
	for rows.Next() {
		var s Stat
		if err := rows.Scan(&s.EventType, &s.Minute, &s.Count); err != nil {
			log.Println("row scan failed:", err)
			continue
		}
		stats = append(stats, s)
	}
	c.JSON(http.StatusOK, stats)
}
