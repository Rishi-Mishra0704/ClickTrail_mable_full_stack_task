package server

import (
	"clicktrail/api/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Server struct {
	router *gin.Engine
	config config.Config
}

func NewServer(config config.Config) (*Server, error) {
	server := &Server{
		config: config,
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

	// Health route
	router.GET("/hello", func(c *gin.Context) {
		c.String(http.StatusOK, "Hello, World!")
	})

	// Auth routes
	auth := router.Group("/auth")

	auth.POST("/signup", s.Signup)
	auth.POST("/login", s.Login)

	s.router = router
}

func (s *Server) Start(address string) error {
	return s.router.Run(address)
}
