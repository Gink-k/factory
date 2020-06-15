package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"text/template"
)

const (
	cdnReact           = "https://unpkg.com/react@16.13.0/umd/react.production.min.js"
	cdnReactDom        = "https://unpkg.com/react-dom@16.13.0/umd/react-dom.production.min.js"
	cdnBabelStandalone = "https://unpkg.com/babel-standalone@6.26.0/babel.min.js"
)

const indexHTML = `
<!DOCTYPE HTML>
<html>
  <head>
    <meta charset="utf-8">
    <title>Simple Go Web App</title>
  </head>
  <body>
    <div id='root'></div>
    <script src="` + cdnReact + `"></script>
    <script src="` + cdnReactDom + `"></script>
    <script src="` + cdnBabelStandalone + `"></script>
	<script src="/frontend/app.jsx" type="text/babel"></script>
	<link href="/static/stylesheets/styles.css" rel="stylesheet">
  </body>
</html>
`

var appTemplate = template.Must(template.New("tmpl").Parse(indexHTML))

func appHandler(w http.ResponseWriter, r *http.Request) {
	appTemplate.Execute(w, nil)
	return
}

func contentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		resp := map[string]string{"content": "", "status": "-1"}
		fileName := filepath.Join("data", r.URL.Query().Get("file")+".txt")
		content, err := ioutil.ReadFile(fileName)
		if err == nil {
			resp["content"] = string(content)
			resp["status"] = "1"
		}
		w.Header().Set("content-type", "application/json")
		err = json.NewEncoder(w).Encode(resp)
		if err != nil {
			http.Error(w, "Iternal server Error", http.StatusInternalServerError)
		}
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func main() {
	//
	fileServer := http.FileServer(http.Dir("frontend"))
	http.Handle("/frontend/", http.StripPrefix("/frontend/", fileServer))
	fileServer = http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fileServer))
	http.HandleFunc("/", appHandler)
	http.HandleFunc("/api/content", contentHandler)
	log.Fatal(http.ListenAndServe(":8000", nil))
}
