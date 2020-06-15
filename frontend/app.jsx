const IMAGE_STORAGE = "/static/images/"

function App(props) {
    window.addEventListener("scroll", handleScroll)
    function handleScroll(event) {
        
    }
    return (
        <div className="content-container">
            <Intro/>
            <Projects/>
        </div>
    )
}

function Intro(props) {
    const contentInfo = useContent("intro")
    const intro = (
        <Section className="intro">
            <h1>{contentInfo[0]}</h1>
        </Section>
    )
    return handleContent(contentInfo, intro)
}

function Projects(props) {
    const contentInfo = useContent("projects")
    const hIndex = contentInfo[0].indexOf("\n")
    const text = contentInfo[0].slice(hIndex)
    const projectList = contentInfo[0].slice(0, hIndex).split(",")
    const projects = (
        <Section className="projects">
            <h1>{text}</h1>
            {projectList.map(value => {
                return <Project key={value} name={value}/>
            })}
        </Section>
    )
    return handleContent(contentInfo, projects)
}

function Project(props) {
    const contentInfo = useContent(props.name)
    const project = (
        <a className="project">
            <h2>{props.name}</h2>
            <Image name={props.name}/>
            <p>{contentInfo[0]}</p>
        </a>
    )
    return handleContent(contentInfo, project)
}

function Image(props) {
    return <img src={IMAGE_STORAGE + props.name + ".jpg"} className={props.className}/>
}

function Section(props) {
    return <div className={props.className + " section"}>{props.children}</div>
}

function useContent(fileName) {
    const [content, setContent] = React.useState("")
    const [isLoaded, setIsLoaded] =  React.useState(false)
    const [error, setError] = React.useState(null)

    React.useEffect(() => {
        const path = "/api/content?file=" + fileName
        fetch(path, {
            method: "GET"
            }
        ).then(res => res.json()
        ).then(
            response => {
                setContent(response.content)
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

ReactDOM.render(
    <App/>,
    document.getElementById("root")
)