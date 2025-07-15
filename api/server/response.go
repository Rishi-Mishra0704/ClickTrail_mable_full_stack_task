package server

func ErrorResponse(err error, message string) map[string]any {
	return map[string]any{
		"success": false,
		"error":   err.Error(),
		"message": message,
	}
}

func SuccessResponse(data any, message string) map[string]any {
	return map[string]any{
		"success": true,
		"message": message,
		"data":    data,
	}
}
