package main

import (
	"log"

	"github.com/Rishi-Mishra0704/ClickTrail/api/config"
	"github.com/Rishi-Mishra0704/ClickTrail/api/server"
)

func main() {

	// Load environment/configuration variables from the project root (e.g., .env)
	cfg, err := config.LoadConfig("./api")
	if err != nil {
		log.Fatal("config load failed:", err)
	}

	// Initialize a new HTTP server with all required dependencies (config, store, auth, etc.)
	server, err := server.NewServer(cfg)
	if err != nil {
		log.Fatal("Failed to create new server:", err)
	}

	// Start the HTTP server on the specified port
	if err := server.Start(cfg.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
