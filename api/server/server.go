package server

import (
	"crypto/rand"
	"encoding/hex"
	"log"
	"net/http"
	"time"

	"github.com/ClickHouse/clickhouse-go/v2"
	"github.com/Rishi-Mishra0704/ClickTrail/api/config"
	"github.com/Rishi-Mishra0704/ClickTrail/api/middleware"
	"github.com/Rishi-Mishra0704/ClickTrail/api/token"
	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
)

type Server struct {
	router     *gin.Engine
	config     config.Config
	maker      token.Maker
	clickhouse clickhouse.Conn
}

func NewServer(config config.Config, clickhouse clickhouse.Conn) (*Server, error) {
	bytes := make([]byte, 16) // 16 bytes → 32 hex chars
	if _, err := rand.Read(bytes); err != nil {
		log.Fatal("failed to generate random bytes:", err)
	}
	secretKey := hex.EncodeToString(bytes)

	maker, err := token.NewJWTMaker(secretKey)
	if err != nil {
		log.Fatal("Failed to create token maker", err)
	}

	server := &Server{
		config:     config,
		maker:      maker,
		clickhouse: clickhouse,
	}
	server.setupRouter()
	return server, nil
}

func (s *Server) setupRouter() {
	gin.SetMode(gin.ReleaseMode)
	if s.config.Mode != "production" {
		gin.SetMode(gin.DebugMode)
	}

	router := gin.New()

	// Logger
	if s.config.Mode != "production" {
		router.Use(gin.Logger())
	}
	router.Use(gin.Recovery())
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	// Health route
	router.GET("/hello", func(c *gin.Context) {
		c.String(http.StatusOK, "Hello, World!")
	})

	// Auth routes
	auth := router.Group("/auth")

	auth.POST("/register", s.Signup)
	auth.POST("/login", s.Login)

	// Event Routes
	event := router.Group("/events")
	event.POST("/add", s.TrackEventHandler)
	// Protected sub-group
	protected := event.Group("/")
	protected.Use(middleware.AuthMiddleware(s.maker))
	protected.GET("/stats", s.StatsHandler)
	s.router = router
}

func (s *Server) Start(address string) error {
	return s.router.Run(address)
}
