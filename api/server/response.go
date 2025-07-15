package server

func ErrorResponse(err error, message string, code int) map[string]any {
	return map[string]any{
		"code":    code,
		"error":   err.Error(),
		"message": message,
	}
}

func SuccessResponse(data any) map[string]any {
	return map[string]any{
		"code":    200,
		"message": "success",
		"data":    data,
	}
}
