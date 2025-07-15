package token

import (
	"time"

	"github.com/Rishi-Mishra0704/ClickTrail/api/models"
)

type Maker interface {
	CreateToken(username string, duration time.Duration) (string, *models.Payload, error)

	VerifyToken(token string) (*models.Payload, error)
}
