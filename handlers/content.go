package handlers

import (
	"factory/models"
	u "factory/utils"
	"log"
	"net/http"
)

func ViewContent(w http.ResponseWriter, r *http.Request) {

}

func EditContent(w http.ResponseWriter, r *http.Request) {
	content := &models.SectionsContent{}
	err := decodeRequest(r, content)
	if err != nil {
		log.Println(err.Error(), r.Body)
		log.Printf("%T, %v", r.Body, r.Body)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	content.Edit()
	response := u.Message(u.SUCCESS, "Content has been edited")
	response["content"] = content
	u.Respond(w, response)
}

func CreateContent(w http.ResponseWriter, r *http.Request) {

}

func DeleteContent(w http.ResponseWriter, r *http.Request) {

}

func ViewAllContent(w http.ResponseWriter, r *http.Request) {
	content, err := models.GetSectionsContent()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	response := u.Message(u.SUCCESS, "Content is ready to view")
	response["content"] = content
	u.Respond(w, response)
}

// func ViewAllContent(w http.ResponseWriter, r *http.Request) {
// 	fullContent := make(map[string]interface{})
// 	mainSectionsContent := models.GetAllContentByRelatedID(0)
// 	for _, section := range mainSectionsContent {
// 		relatedContent := models.GetAllContentByRelatedID(section.ID)
// 		fullContent[section.Title] = models.SectionContent{Content: section, RelatedContent: relatedContent}
// 	}
// 	response := u.Message(u.SUCCESS, "Content is ready to view")
// 	response["content"] = fullContent
// 	u.Respond(w, response)
// }
