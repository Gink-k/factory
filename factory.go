package main

import (
	"factory/handlers"
	"log"
	"net/http"
	"os"
	"regexp"
)

type route struct {
	pattern *regexp.Regexp
	handler http.Handler
	methods []string
}

type RegexpHandler struct {
	routes []*route
}

func (h *RegexpHandler) Methods(methods ...string) *RegexpHandler {
	h.routes[len(h.routes)-1].methods = methods
	return h
}

func (h *RegexpHandler) Handler(strPattern string, handler http.Handler) *RegexpHandler {
	pattern := mustCompile(strPattern)
	h.routes = append(h.routes, &route{pattern, handler, nil})
	return h
}

func (h *RegexpHandler) HandleFunc(strPattern string, handler func(http.ResponseWriter, *http.Request)) *RegexpHandler {
	pattern := mustCompile(strPattern)
	h.routes = append(h.routes, &route{pattern, http.HandlerFunc(handler), nil})
	return h
}

func (h *RegexpHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	for _, route := range h.routes {
		if route.pattern.MatchString(r.URL.Path) {
			if route.containMethod(r.Method) {
				route.handler.ServeHTTP(w, r)
				return
			}
		}
	}
	// no pattern matched; send 404 response
	http.HandlerFunc(handlers.MakeHandler("other")).ServeHTTP(w, r)
}

func mustCompile(pattern string) *regexp.Regexp {
	return regexp.MustCompile("^" + pattern + "$")
}

func (r *route) containMethod(method string) bool {
	if len(r.methods) == 0 && method == "GET" {
		return true
	}
	for _, m := range r.methods {
		if m == method {
			return true
		}
	}
	return false
}

func main() {
	router := RegexpHandler{}
	fileServer := http.FileServer(http.Dir("frontend"))
	router.Handler("/frontend/.*", http.StripPrefix("/frontend/", fileServer))
	fileServer = http.FileServer(http.Dir("static"))
	router.Handler("/static/.*", http.StripPrefix("/static/", fileServer))
	router.HandleFunc("/", handlers.MakeHandler("index"))
	router.HandleFunc("/admin", handlers.MakeHandler("admin"))
	router.HandleFunc("/api/content", handlers.ViewAllContent).Methods("GET")
	router.HandleFunc("/api/content", handlers.EditContent).Methods("PUT")
	router.HandleFunc("/news/[1-9][0-9]*", handlers.MakeHandler("news"))
	router.HandleFunc("/api/news", handlers.GetNews)
	router.HandleFunc("/api/content", handlers.EditContent)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	log.Fatal(http.ListenAndServe(":"+port, &router))
}
