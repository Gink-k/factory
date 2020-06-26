package handlers

import (
	"encoding/json"
	"errors"
	"factory/models"
	"net/http"
	"text/template"
)

var templates = template.Must(template.New("tmpl").ParseGlob("tmpl/*"))

func renderTemplate(w http.ResponseWriter, tmpl string, data map[string]interface{}) {
	err := templates.ExecuteTemplate(w, tmpl+".html", data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func decodeRequest(r *http.Request, content *models.SectionsContent) error {
	if r.Header.Get("Content-Type") == "application/json" {
		return json.NewDecoder(r.Body).Decode(content)
	}
	return errors.New("Content-Type header is not application/json")
}
