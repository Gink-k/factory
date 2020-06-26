package models

import (
	"encoding/json"
	"io/ioutil"
)

type Content struct {
	ID             uint
	Title          string    `json:"title"`
	Text           string    `json:"text"`
	ImageName      string    `json:"imageName"`
	RelatedContent []Content `json:"related_content"`
}

type SectionsContent map[string]Content

var contentFile string = "data/main.json"

func GetSectionsContent() (SectionsContent, error) {
	var data SectionsContent
	content, _ := ioutil.ReadFile(contentFile)
	err := json.Unmarshal(content, &data)
	return data, err
}

func (content *SectionsContent) Edit() error {
	data, err := json.Marshal(content)
	if err != nil {
		return err
	}
	return ioutil.WriteFile(contentFile, data, 660)
}

func (content SectionsContent) Get(section string) *Content {
	res := content[section]
	return &res
}

// type Content struct {
// 	gorm.Model
// 	Title            string `json:"title"`
// 	Text             string `json:"text"`
// 	RelatedContentID uint   `gorm:"default:0"`
// }

// type SectionContent struct {
// 	Content
// 	RelatedContent []Content `json:"related_content"`
// }

// func (content *Content) Create() map[string]interface{} {
// 	GetDB().Create(content)
// 	response := u.Message(u.SUCCESS, "Content has been created")
// 	response["content"] = content
// 	return response
// }

// func (content *Content) Edit() map[string]interface{} {
// 	GetDB().Save(content)
// 	response := u.Message(u.SUCCESS, "Content has been edited")
// 	response["content"] = content
// 	return response
// }

// func (content *Content) Delete() map[string]interface{} {
// 	GetDB().Delete(content)
// 	response := u.Message(u.SUCCESS, "Content has been deleted")
// 	response["content"] = content
// 	return response
// }

// func GetContentByID(id uint) *Content {
// 	content := &Content{}
// 	GetDB().Table("contents").Where("id = ?", id).Find(content)
// 	return content
// }

// func GetContentByTitle(title string) *Content {
// 	content := &Content{}
// 	GetDB().Table("contents").Where("title = ?", title).Find(content)
// 	return content
// }

// func GetAllContent() []Content {
// 	all := []Content{}
// 	GetDB().Table("contents").Find(all)
// 	return all
// }

// func GetAllContentByRelatedID(relID uint) []Content {
// 	var all []Content
// 	GetDB().Table("contents").Where("related_content_id = ?", relID).Find(&all)
// 	return all
// }
