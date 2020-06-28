import React from "react"
import ReactDOM from "react-dom"
import {List, ListItem, LinkListItem, Image, BackgroundImage, useResponse} from "./base"

function App(props) {
    const [response, isLoaded, error] = useResponse()
    if (error) {
        return <div>Произошла ошибка, пожалуйста, попробуйте перезагрузить страницу!</div>
    } else if (!isLoaded) {
        return <div>Идет загрузка</div>
    } else {
        const content = response.content
        return (
            <div className="content-container">
                <Intro content={content.intro}/>
                <Projects content={content.projects}/>
                <Science content={content.science}/>
                <Partners content={content.partners}/>
                <News content={content.news}/>
                <Connections content={content.connections}/>
                <Footer content={content.footer}/>
            </div>
        )
    }
}

// #################
// Top level Section
// #################

function Intro(props) {
    const content = props.content || {}
    const related_content = content.related_content || []
    const text = content.text
    const addAnimationOnLoad = React.useCallback(node => {
        if (node !== null) for (let elem of node.children) addAnimation(elem, `1.8s fade-in ease`)
    }, [])
    return (
        <Section _ref={addAnimationOnLoad} className="intro">
            <div className="text-wrap">
                <h1>{text}</h1>
            </div>
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

// #################
// Top level Section
// #################

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
        <Section className="projects">
            <Project header={content.text} content={currProject}>
                <Slider imageName={currProject.title} 
                    handlePrevClick={() => handePrNavButtonClick(currProject, "prev")} 
                    handleNextClick={() => handePrNavButtonClick(currProject, "next")}>
                    <ProgressBar contentId={currProject.ID} duration={showDuration}/>
                </Slider>        
            </Project>
        </Section>
    )
}

function Project(props) {
    const content = props.content || {}
    return (
        <React.Fragment>
            <aside>
                {props.children}
            </aside>
            <article>
                <h1>{props.header}</h1>
                <h2>{content.title}</h2>
                <p>{content.text}</p>
            </article>
        </React.Fragment>
    )
}

function Slider(props) {
    return (
        <div>
            <NavArrow direction="next" handleClick={props.handleNextClick}/>
            <NavArrow direction="prev" handleClick={props.handlePrevClick}/>
            <a className="project">
                <BackgroundImage name={props.imageName+".jpg"}/>
                {props.children}
            </a>
        </div>
    )
}

// #################
// Top level Section
// #################

function Science(props) {
    const content = props.content || {}
    const related_content = content.related_content || []
    return (
        <Section className="science" title={content.title}>
            <List items={related_content} specListItemComponent={Paragraph}/>
        </Section>
    )
}

function Paragraph(props) {
    const content = props.content || {}
    return (
        <ListItem content={{...content, "imageName": content.title}} data-animation={`1.8s fade-in ease forwards`}/>
    )
}

// #################
// Top level Section
// #################

function Partners(props) {
    const content = props.content || {}
    const related_content = content.related_content || []
    return (
        <Section className="partners" title={content.title}>
            <List items={related_content} specListItemComponent={LinkListItem}/>
        </Section>
    )
}

// #################
// Top level Section
// #################

function News(props) {
    const content         = props.content || {}
    const related_content = content.related_content || []
    const maxAmount       = 6
    related_content.forEach(elem => {elem.href = `/news/${elem.ID}`})
    const news = related_content.slice(0, maxAmount)
    const btnTextShow = "Показать все новости", btnTextHide = "Скрыть"
    const [currentNewsSlice, setCurrentNewsSlice] = React.useState({"news": news, "buttonText": btnTextShow})
    const handleClick = (e) => {
        e.preventDefault()
        if(currentNewsSlice.buttonText == btnTextShow) {
            setCurrentNewsSlice({"news": related_content, "buttonText": btnTextHide})
        } else {
            setCurrentNewsSlice({"news": news, "buttonText": btnTextShow})
        }
    }
    return (
        <Section className="news" title={content.title}>
            <div>
                <List items={currentNewsSlice.news} specListItemComponent={LinkListItem}/>
                <div className="btn-wrap">
                    <a className="btn" onClick={handleClick}>{currentNewsSlice.buttonText}</a>
                </div>
            </div>
        </Section>
    )    
}

// #################
// Top level Section
// #################


function Connections(props) {
    const content         = props.content || {}
    const related_content = content.related_content || []

    return (
        <Section className="connections" title={content.title}>
            <List items={related_content}/>
        </Section>
    )
}

// #################
// Top level Section
// #################

function Footer(props) {
    const content = props.content || {}
    const related_content = content.related_content || []
    return (
        <footer className="footer section" id="footer">
            {related_content.map(newList => {
                return (
                    <div key={newList.ID}>    
                        <h4>{newList.title}</h4>
                        <List items={newList.related_content} specListItemComponent={LinkListItem}/>
                    </div>
                )
            })}
        </footer>
    )
}

function RawLink(props) {
    const {children, ...rest} = props
    return <a {...rest}>{children}</a>
}

function Section(props) {
    const {className, title, children, _ref, ...rest} = props
    const header = title && <h1>{props.title}</h1>
    const sectionRef = React.useCallback((section) => {
        if (section !== null) {
            if (window.location.hash == "#" + className) section.scrollIntoView()
            if (typeof _ref == "function") _ref(section)
        }
    }, [])
    return (
        <section className={className + " section"} id={className} ref={sectionRef} {...rest} data-animate-section>
            {header}
            {children}
        </section>
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
          bBorder = elem.offsetTop + elem.offsetHeight,
          tBorder = elem.offsetTop
    return (pageYOffset < bBorder && tBorder < yOffsetBot)
}

function fadedIn(elem) {
    return elem.style.animation //elem.classList.contains("fade-in")
}

ReactDOM.render(
    <App/>,
    document.getElementById("root")
)