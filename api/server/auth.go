package server

import (
	"net/http"

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

	user, err := models.CreateUser(req.Name, req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse(err, "Couldnt Create User"))
		return
	}

	c.JSON(http.StatusOK, SuccessResponse(user, "User Created Successfully"))

}
func (s *Server) Login(c *gin.Context) {

}
