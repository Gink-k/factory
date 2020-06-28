package handlers

import (
	"net/http"
)

func MakeHandler(tmpl string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		renderTemplate(w, tmpl, nil)
		return
	}
}
