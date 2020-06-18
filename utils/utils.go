package utils

import (
	"encoding/json"
	"net/http"
)

const (
	ERROR   int = -1
	WARNING int = 0
	SUCCESS int = 1
)

func Message(status int, message string) map[string]interface{} {
	return map[string]interface{}{"status": status, "message": message}
}

func Respond(w http.ResponseWriter, data map[string]interface{}) {
	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
