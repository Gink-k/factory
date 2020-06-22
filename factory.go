package main

import (
	"factory/handlers"
	"log"
	"net/http"
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

func main() {
	//
	fileServer := http.FileServer(http.Dir("frontend"))
	http.Handle("/frontend/", http.StripPrefix("/frontend/", fileServer))
	fileServer = http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fileServer))
	http.HandleFunc("/", appHandler)
	http.HandleFunc("/api/content", handlers.ViewAllContent)
	log.Fatal(http.ListenAndServe(":8000", nil))
}
