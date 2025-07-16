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
