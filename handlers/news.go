package handlers

import (
	"factory/models"
	u "factory/utils"
	"net/http"
)

func GetNews(w http.ResponseWriter, r *http.Request) {
	sections, err := models.GetSectionsContent()
	if err != nil {
		http.Error(w, "Iternal server error", http.StatusInternalServerError)
		return
	}
	news := sections.Get("news")
	response := u.Message(u.SUCCESS, "News is ready to view")
	response["news"] = news
	u.Respond(w, response)
}
