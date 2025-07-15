package models

import (
	"errors"
	"sync"

	"github.com/google/uuid"
)

type User struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

var (
	users   = make(map[string]User)
	usersMu sync.RWMutex
)

// CreateUser adds a new user and returns it
func CreateUser(name, email, password string) (User, error) {
	if name == "" || email == "" || password == "" {
		return User{}, errors.New("missing user fields")
	}

	usersMu.Lock()
	defer usersMu.Unlock()

	// Ensure email is unique
	for _, u := range users {
		if u.Email == email {
			return User{}, errors.New("email already exists")
		}
	}

	id := uuid.New().String()
	user := User{
		ID:       id,
		Name:     name,
		Email:    email,
		Password: password,
	}
	users[email] = user
	return user, nil
}

// GetUser returns a user by Email
func GetUser(email string) (User, error) {
	if email == "" {
		return User{}, errors.New("invalid user email")
	}

	usersMu.RLock()
	defer usersMu.RUnlock()

	user, exists := users[email]
	if !exists {
		return User{}, errors.New("user not found")
	}
	return user, nil
}

// GetAllUsers returns all users
func GetAllUsers() ([]User, error) {
	usersMu.RLock()
	defer usersMu.RUnlock()

	if len(users) == 0 {
		return nil, errors.New("no users found")
	}

	result := make([]User, 0, len(users))
	for _, user := range users {
		result = append(result, user)
	}
	return result, nil
}

// UpdateUser updates the fields of an existing user
func UpdateUser(id string, name, email, password string) (User, error) {
	if id == "" {
		return User{}, errors.New("invalid user id")
	}

	usersMu.Lock()
	defer usersMu.Unlock()

	user, exists := users[id]
	if !exists {
		return User{}, errors.New("user not found")
	}

	if name != "" {
		user.Name = name
	}
	if email != "" {
		user.Email = email
	}
	if password != "" {
		user.Password = password
	}

	users[id] = user
	return user, nil
}

// DeleteUser removes a user by ID
func DeleteUser(id string) error {
	if id == "" {
		return errors.New("invalid user id")
	}

	usersMu.Lock()
	defer usersMu.Unlock()

	if _, exists := users[id]; !exists {
		return errors.New("user not found")
	}
	delete(users, id)
	return nil
}
