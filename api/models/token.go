package models

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

var (
	ErrInvalidToken = errors.New("token is invalid")
	ErrExpiredToken = errors.New("token has expired")
)

type Payload struct {
	ID        uuid.UUID `json:"id"`
	Username  string    `json:"username"`
	IssuedAt  time.Time `json:"issued_at"`
	ExpiredAt time.Time `json:"expired_at"`
}

// Valid checks if the token payload is valid or not
func (payload Payload) Valid() error {
	if time.Now().After(payload.ExpiredAt) {
		return ErrExpiredToken
	}
	return nil
}

// GetAudience implements jwt.Claims.
func (Payload) GetAudience() (jwt.ClaimStrings, error) {
	return []string{}, nil
}

// GetExpirationTime implements jwt.Claims.
func (Payload) GetExpirationTime() (*jwt.NumericDate, error) {
	return nil, nil
}

// GetIssuedAt implements jwt.Claims.
func (Payload) GetIssuedAt() (*jwt.NumericDate, error) {
	return nil, nil
}

// GetIssuer implements jwt.Claims.
func (Payload) GetIssuer() (string, error) {
	return "", nil
}

// GetNotBefore implements jwt.Claims.
func (Payload) GetNotBefore() (*jwt.NumericDate, error) {
	return nil, nil
}

// GetSubject implements jwt.Claims.
func (Payload) GetSubject() (string, error) {
	return "", nil
}
