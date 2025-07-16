package utils

import "time"

func GetString(v interface{}) string {
	if s, ok := v.(string); ok {
		return s
	}
	return ""
}

func ParseTime(v interface{}) time.Time {
	s := GetString(v)
	t, err := time.Parse(time.RFC3339, s)
	if err != nil {
		return time.Now().UTC()
	}
	return t
}
