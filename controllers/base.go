package controllers

import (
	"encoding/json"
	"errors"
	"factory/models"
	"net/http"
)

func decodeRequest(r *http.Request, content *models.Content) error {
	if r.Header.Get("Content-Type") == "application/json" {
		return json.NewDecoder(r.Body).Decode(content)
	}
	msg := "Content-Type header is not application/json"
	return errors.New(msg)
}
