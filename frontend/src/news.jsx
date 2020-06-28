import React from "react"
import ReactDOM from "react-dom"
import {Logo, Article, List, LinkListItem, useResponse} from "./base"

function News(props) {
    const [response, isLoaded, error] = useResponse("/api/news")
    if (error) {
        return <div>Произошла ошибка, пожалуйста, попробуйте перезагрузить страницу!</div>
    } else if (!isLoaded) {
        return <div>Идет загрузка</div>
    } else {
        let articles = response.news.related_content
        let currArticleIndex = -1
        const currArticleID = getCurrentArticleID()
        const currArticle   = articles.find((elem, index) => { 
            return elem.ID == currArticleID && (currArticleIndex = index)
        })
        articles.splice(currArticleIndex, 1)
        return (
            <div>
                <Logo/>
                <MainArticle article={currArticle}/>
                <NewsListColumn items={articles}/>
            </div>
        )
    }
}

function MainArticle(props) {
    return (
        <div className="main-article"><Article {...props.article}/></div>
    )
}

function NewsListColumn(props) {
    let news = props.items 
    news.forEach(elem => {
        elem.text = ""
        elem.href = `/news/${elem.ID}`
    })
    return (
        <List className="news-list" items={news} specListItemComponent={LinkListItem}/>
    )
}

function getCurrentArticleID() {
    const path = window.location.pathname
    return path.slice(path.lastIndexOf("/") + 1)
}

ReactDOM.render(
    <News/>,
    document.getElementById("root")
)