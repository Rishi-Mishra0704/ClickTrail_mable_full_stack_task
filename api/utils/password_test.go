package utils

import (
	"testing"

	"github.com/Rishi-Mishra0704/ClickTrail/api/models"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

func TestHashPassword(t *testing.T) {
	password := RandomString(6)
	hashedPassword1, err := HashPassword(password)
	assert.NoError(t, err)
	assert.NotEmpty(t, hashedPassword1)

	err = CheckPassword(password, hashedPassword1)
	assert.NoError(t, err)
	wrongPassword := RandomString(6)

	err = CheckPassword(wrongPassword, hashedPassword1)
	assert.EqualError(t, err, bcrypt.ErrMismatchedHashAndPassword.Error())

	hashedPassword2, err := HashPassword(password)
	assert.NoError(t, err)
	assert.NotEmpty(t, hashedPassword2)
	assert.NotEqual(t, hashedPassword1, hashedPassword2)
}

func TestValidatePassword(t *testing.T) {
	tests := []models.PasswordTestCase{
		{Name: "Valid password", Password: "Password1", Valid: true},
		{Name: "Too short", Password: "P1a", Valid: false},
		{Name: "Missing uppercase", Password: "password1", Valid: false},
		{Name: "Missing lowercase", Password: "PASSWORD1", Valid: false},
		{Name: "Missing digit", Password: "Password", Valid: false},
	}

	for _, tt := range tests {
		t.Run(tt.Name, func(t *testing.T) {
			err := ValidatePassword(tt.Password)
			if tt.Valid {
				assert.NoError(t, err)
			} else {

				assert.Error(t, err)
			}
		})
	}
}
