package handlers

import (
	"net/http"
)

func MainPageHandler(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "index", nil)
	return
}

func NewsPageHandler(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "news", nil)
	return
}

func IncorrectPageHandler(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "other", nil)
	return
}
