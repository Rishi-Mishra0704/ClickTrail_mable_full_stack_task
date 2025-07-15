package server

import (
	"net/http"
	"time"

	"github.com/Rishi-Mishra0704/ClickTrail/api/models"
	"github.com/Rishi-Mishra0704/ClickTrail/api/utils"
	"github.com/gin-gonic/gin"
)

type SignupRequest struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

func (s *Server) Signup(c *gin.Context) {
	var req SignupRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse(err, "Name, Email and Password are required"))
		return
	}

	if err := utils.ValidatePassword(req.Password); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse(err, "Password should meet the conditions"))
		return
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse(err, "Couldnt Hash Password"))
		return
	}

	user, err := models.CreateUser(req.Name, req.Email, hashedPassword)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse(err, "Couldnt Create User"))
		return
	}

	response := gin.H{
		"name":  user.Name,
		"email": user.Email,
		"id":    user.ID,
	}

	c.JSON(http.StatusOK, SuccessResponse(response, "User Created Successfully"))

}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

func (s *Server) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse(err, "Email and Password are required"))
		return
	}

	// 1. Lookup user by email
	user, err := models.GetUser(req.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, ErrorResponse(err, "User was not found in DB"))
		return
	}

	// 2. Check password
	if err := utils.CheckPassword(req.Password, user.Password); err != nil {
		c.JSON(http.StatusUnauthorized, ErrorResponse(err, "Invalid password"))
		return
	}

	// 3. Parse token duration
	tokenDuration, err := time.ParseDuration(s.config.TokenDuration)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse(err, "Invalid token duration"))
		return
	}

	// 4. Generate JWT
	token, payload, err := s.maker.CreateToken(user.Email, tokenDuration)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse(err, "Could not create token"))
		return
	}

	// 5. Return response
	response := gin.H{
		"id":         user.ID,
		"name":       user.Name,
		"email":      user.Email,
		"token":      token,
		"expires_at": payload.ExpiredAt,
	}

	c.JSON(http.StatusOK, SuccessResponse(response, "Login successful"))
}
