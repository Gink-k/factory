const IMAGE_STORAGE = "/static/images/"

function App(props) {
    const [response, isLoaded, error] = useResponse()
    if (error) {
        return <div>Произошла ошибка, пожалуйста, попробуйте перезагрузить страницу!</div>
    } else if (!isLoaded) {
        return <div>Идет загрузка</div>
    } else { 
        return (
            <div className="content-container">
                <Intro content={response.content.intro}/>
                <Projects content={response.content.projects}/>
            </div>
        )
    }
}

function Intro(props) {
    const text = props.content.text
    return (
        <Section className="intro">
            <h1>{text}</h1>
        </Section>
    )
}

function Projects(props) {
    const content = props.content || {}
    const related_content = content.related_content || []
    return (
        <Section className="projects">
            <h1>{content.text}</h1>
            {related_content.map(value => {
                return <Project key={value.ID} content={value}/>
            })}
        </Section>
    )
}

function Project(props) {
    const content = props.content || {} 
    return (
        <a className="project" data-animate>
            <h2>{content.title}</h2>
            <Image name={content.title}/>
            <p>{content.text}</p>
        </a>
    )
}

function Image(props) {
    return <img src={IMAGE_STORAGE + props.name + ".jpg"} className={props.className}/>
}

function Section(props) {
    return <div className={props.className + " section"}>{props.children}</div>
}

function useResponse(path) {
    const [content, setContent] = React.useState("")
    const [isLoaded, setIsLoaded] =  React.useState(false)
    const [error, setError] = React.useState(null)

    React.useEffect(() => {
        const path = path || "/api/content"
        fetch(path, {
            method: "GET"
            }
        ).then(res => res.json()
        ).then(
            response => {
                setContent(response)
                setIsLoaded(true)
            },
            reason => setError(reason)
        )
    }, [])
    return [content, isLoaded, error] 
}

function handleContent(contentInfo, contentViewer) {
    const [content, isLoaded, error] = contentInfo
    if (error) {
        return <div>Произошла ошибка, пожалуйста, попробуйте перезагрузить страницу!</div>
    } else if (!isLoaded) {
        return <div>Идет загрузка</div>
    } else { 
        return contentViewer
        
    }
}

window.addEventListener("scroll", () => {
    let duration = 2
    let aElems = document.querySelectorAll("*[data-animate]")
    for (let elem of aElems) {
        if (onWindow(elem)) {
            if (!fadedIn(elem)) {
                elem.style.animation = `${duration}s fade-in ease`
            }
        } else if (fadedIn(elem)) {
            elem.style.animation = ""
        }
    }
})

function onWindow(elem) {
    const yOffsetBot = pageYOffset + window.innerHeight,
          tBorder = elem.offsetTop + elem.offsetHeight - 10,
          bBorder = elem.offsetTop + 10
    return (pageYOffset < tBorder && bBorder < yOffsetBot)
}

function fadedIn(elem) {
    return elem.style.animation //elem.classList.contains("fade-in")
}

ReactDOM.render(
    <App/>,
    document.getElementById("root")
)