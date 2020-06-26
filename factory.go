package main

import (
	"factory/handlers"
	"log"
	"net/http"
	"regexp"
)

type route struct {
	pattern *regexp.Regexp
	handler http.Handler
}

type RegexpHandler struct {
	routes []*route
}

func mustCompile(pattern string) *regexp.Regexp {
	return regexp.MustCompile("^" + pattern + "$")
}

func (h *RegexpHandler) Handler(strPattern string, handler http.Handler) {
	pattern := mustCompile(strPattern)
	h.routes = append(h.routes, &route{pattern, handler})
}

func (h *RegexpHandler) HandleFunc(strPattern string, handler func(http.ResponseWriter, *http.Request)) {
	pattern := mustCompile(strPattern)
	h.routes = append(h.routes, &route{pattern, http.HandlerFunc(handler)})
}

func (h *RegexpHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	for _, route := range h.routes {
		if route.pattern.MatchString(r.URL.Path) {
			route.handler.ServeHTTP(w, r)
			return
		}
	}
	// no pattern matched; send 404 response
	http.HandlerFunc(handlers.IncorrectPageHandler).ServeHTTP(w, r)
}

func main() {
	router := RegexpHandler{}
	fileServer := http.FileServer(http.Dir("frontend"))
	router.Handler("/frontend/.*", http.StripPrefix("/frontend/", fileServer))
	fileServer = http.FileServer(http.Dir("static"))
	router.Handler("/static/.*", http.StripPrefix("/static/", fileServer))
	router.HandleFunc("/", handlers.MainPageHandler)
	router.HandleFunc("/api/content", handlers.ViewAllContent)
	router.HandleFunc("/news/[1-9][0-9]*", handlers.NewsPageHandler)
	router.HandleFunc("/api/news", handlers.GetNews)
	log.Fatal(http.ListenAndServe(":8000", &router))
}
