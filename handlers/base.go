package handlers

import (
	"encoding/json"
	"errors"
	"factory/models"
	"io/ioutil"
	"net/http"
)

func decodeRequest(r *http.Request, content *models.Content) error {
	if r.Header.Get("Content-Type") == "application/json" {
		return json.NewDecoder(r.Body).Decode(content)
	}
	msg := "Content-Type header is not application/json"
	return errors.New(msg)
}

func readJSON(filename string) (interface{}, error) {
	content, _ := ioutil.ReadFile(filename)
	var data interface{}
	err := json.Unmarshal(content, &data)
	return data, err
}