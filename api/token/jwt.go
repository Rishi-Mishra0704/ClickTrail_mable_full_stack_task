package token

import (
	"fmt"
	"time"

	"github.com/Rishi-Mishra0704/ClickTrail/api/models"
	"github.com/golang-jwt/jwt/v5"
)

const minSecretKeySize = 32

type JWTMaker struct {
	secretKey string
}

func NewJWTMaker(secretKey string) (Maker, error) {
	if len(secretKey) < minSecretKeySize {
		return nil, fmt.Errorf("invalid key size: Must be atleast %d characters", minSecretKeySize)
	}
	return &JWTMaker{secretKey}, nil
}
func (maker *JWTMaker) CreateToken(username string, duration time.Duration) (string, *models.Payload, error) {
	payload, err := NewPayLoad(username, duration)
	if err != nil {
		return "", payload, err
	}
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, payload)
	token, err := jwtToken.SignedString([]byte(maker.secretKey))

	return token, payload, err
}

func (maker *JWTMaker) VerifyToken(token string) (*models.Payload, error) {
	keyFunc := func(token *jwt.Token) (interface{}, error) {
		// Check if the signing method is HMAC
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, models.ErrInvalidToken
		}
		return []byte(maker.secretKey), nil
	}

	// Parse and verify the token
	jwtToken, err := jwt.ParseWithClaims(token, &models.Payload{}, keyFunc)
	if err != nil {
		return nil, fmt.Errorf("error during token verification: %v", err)
	}

	// Extract payload
	payload, ok := jwtToken.Claims.(*models.Payload)
	if !ok {
		return nil, models.ErrInvalidToken
	}

	// Check token validity, including expiration
	if err := payload.Valid(); err != nil {
		return nil, err
	}

	return payload, nil
}
