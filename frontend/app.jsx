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
        <Section className="intro" data-animate-section>
            <h1>{text}</h1>
            <article>
                <Garden/>
            </article>
        </Section>
    )
}

function Garden(props) {
    return (
        <div>
            <Flower name="red"/>
            <Flower name="purple"/>
            <Flower name="yellow"/>
        </div>
    )
}

function Flower(props) {
    const animation = "1.8s grow ease forwards"
    return (
        <div className="stem-wrap">
            <Image name={props.name + "_flower.svg"} style={{"animation": animation}} data-animation={animation}/>
        </div>
    )
}

function Projects(props) {
    const showDuration = 10000
    const content = props.content || {}
    const related_content = content.related_content || []
    const [currProject, setCurrProject] = React.useState(related_content[0])
    let timeoutId = 0

    React.useEffect(() => {
        timeoutId = setTimeout(() => handePrNavButtonClick(currProject), showDuration)
    }, [currProject])

    function handePrNavButtonClick(project, direction="next") {
        let nextProject = {}
        const lastPIndex = related_content.length - 1
        const indexOfCurr = related_content.indexOf(project)//findIndex((elem) => elem.ID == (project && project.ID))
        if (direction == "next")
            nextProject = indexOfCurr == lastPIndex ? related_content[0] : related_content[indexOfCurr + 1]
        else
            nextProject = indexOfCurr == 0 ? related_content[lastPIndex] : related_content[indexOfCurr - 1]
        clearTimeout(timeoutId)
        setCurrProject(nextProject)
    }
    return (
        <Section className="projects" data-animate-section>
            <aside>
                <div>
                    <NavArrow direction="next" handleClick={() => handePrNavButtonClick(currProject, "next")}/>
                    <NavArrow direction="prev" handleClick={() => handePrNavButtonClick(currProject, "prev")}/>
                    <Project content={currProject}>
                        <ProgressBar contentId={currProject.ID} duration={showDuration}/>
                    </Project>
                </div>
            </aside>
            <article>
                {content.text}
            </article>
        </Section>
    )
}

function NavArrow(props) {
    const className  = props.direction + "-arrow arrow-btn"
    const style = props.direction == "prev" ? {"transform": "rotate(90deg)"} : {"transform": "rotate(-90deg)"}
    function handleClick(e) {
        e.preventDefault()
        props.handleClick()
    }
    return (
        <a className={className} onClick={handleClick}>
            <Image name={"arrow.svg"} style={style}/>
        </a>
    )
}

function Project(props) {
    const content = props.content || {} 
    return (
        <a className="project">
            <h2>{content.title}</h2>
            <BackgroundImage name={content.title}/>
            <p>{content.text}</p>
            {props.children}
        </a>
    )
}

function Image(props) {
    const {name, className, ...rest} = props
    return <img src={IMAGE_STORAGE + name} className={className} {...rest}/>
}

function BackgroundImage(props) {
    const className = props.className && props.className + " image-div" || "image-div" 
    return <div style={{"backgroundImage" : `url("${IMAGE_STORAGE}${props.name}.jpg")`}} className={className}></div>
}

function Section(props) {
    const {className, children, ...rest} = props
    return <section className={className + " section"} {...rest}>{children}</section>
}

function ProgressBar(props) {
    const pbar  = React.useRef()
    const timer = React.useRef()
    let start = Date.now()
    let padding = 0
    React.useEffect(() => {
        clearInterval(timer.current)
        timer.current = setInterval(() => {
            let timePassed = Date.now() - start
            padding += 100 * 20 / props.duration
            if (timePassed >= props.duration - 50) {
                clearInterval(timer.current)
                return
            }
            pbar.current.style.paddingRight = padding + "%"
        }, 20)
    }, [props.contentId])
    return (
        <div className="progress-bar">
            <div ref={pbar}/>{/* style={{"animation":`${props.duration}ms progress-bar linear ${props.infinite? "infinite" : ""}`}}></div> */}
        </div>
    )
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
    let duration = 1.8
    document.querySelectorAll("*[data-animate-section]").forEach((section) => {
        for (let elem of section.children) {
            addAnimation(elem, `${duration}s fade-in ease`)
        }
        section.querySelectorAll("*[data-animation]").forEach((animateElem) => {
            const animation = animateElem.dataset.animation
            addAnimation(animateElem, animation) 
        })
    })
})

function addAnimation(elem, cssAnimation) {
    if (onWindow(elem)) {
        if (!fadedIn(elem)) {
            elem.style.animation = cssAnimation
        }
    } else if (fadedIn(elem)) elem.style.animation = ""
}

function onWindow(elem) {
    const yOffsetBot = pageYOffset + window.innerHeight,
          tBorder = elem.offsetTop + elem.offsetHeight - 5,
          bBorder = elem.offsetTop + 5
    return (pageYOffset < tBorder && bBorder < yOffsetBot)
}

function fadedIn(elem) {
    return elem.style.animation //elem.classList.contains("fade-in")
}

ReactDOM.render(
    <App/>,
    document.getElementById("root")
)