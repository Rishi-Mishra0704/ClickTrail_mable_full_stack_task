package token

import (
	"time"

	"github.com/Rishi-Mishra0704/ClickTrail/api/models"
	"github.com/google/uuid"
)

func NewPayLoad(username string, duration time.Duration) (*models.Payload, error) {
	tokenId, err := uuid.NewRandom()

	if err != nil {
		return nil, err
	}

	payload := &models.Payload{
		ID:        tokenId,
		Username:  username,
		IssuedAt:  time.Now(),
		ExpiredAt: time.Now().Add(duration),
	}

	return payload, nil
}
