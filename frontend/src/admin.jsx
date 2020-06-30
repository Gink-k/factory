import React from "react"
import ReactDOM from "react-dom"
import {List, ListItem, LinkListItem, Image, BackgroundImage, useResponse} from "./base"

function Admin(props) {
    const [response, isLoaded, error] = useResponse()
    if (error) {
        return <div>Произошла ошибка, пожалуйста, попробуйте перезагрузить страницу!</div>
    } else if (!isLoaded) {
        return <div>Идет загрузка</div>
    } else {
        const content = response.content
        return (
            <div className="content-container">
                <EditPanel content={content}/>
            </div>
        )
    }
}

function EditPanel(props) {
    const editText = "Редактировать", backText = "Назад"
    const [changedContent, setChangedContent] = React.useState(props.content)
    const [state, setState] = React.useState({"edit": false, "buttonText": editText})

    const handleClick = (e) => {
        e.preventDefault()
        if (state.edit) {
            setState({"edit": false, "buttonText": editText})
        } else {
            setState({"edit": true, "buttonText": backText})
        }
    }
    function handleSubmit(e) {
        const url = "/api/content"
        e.preventDefault()
        fetch(url, {
            body: JSON.stringify(changedContent),
            method: "PUT",
            headers: {'Content-Type': 'application/json'}
        }).then(null, error => console.log(error))
    }
    function handleChange(newContent) {
        setChangedContent({...changedContent, ...newContent})
    }
    return (
        <form className="admin-form" onSubmit={handleSubmit}>
            {Object.entries(props.content).map(([key, value]) => {
                return ( 
                    <div key={value.ID}>    
                        <h1>{key}</h1>
                        <a className="btn" onClick={handleClick}>{state.buttonText}</a>
                        <Section content={value} name={key} handleChange={handleChange} readOnly={!state.edit}/>
                    </div>
                )
            })}
            <input type="submit" value="Сохранить"/>
        </form>
    )
}

function Section(props) {
    const content  = props.content || [] 
    const [fieldsState, setFieldsState] = React.useState(props.content)

    React.useEffect(() => {
        props.handleChange({[props.name]: fieldsState})
    }, [fieldsState])

    function handleChange(e) {
        const name = e.target.name, value = e.target.value
        setFieldsState({...fieldsState, [name]:value})
    }
    function handleRelContentChange(newContent) {
        const index = content.related_content.findIndex((elem) => elem.ID == newContent["related_content"].ID)
        let new_related_content = fieldsState.related_content
        new_related_content[index] = newContent["related_content"]
        setFieldsState({...fieldsState, related_content: new_related_content})
    }
    const title = content.title && <input type="text" name="title" value={fieldsState.title}/>,
          text  = content.text  && <textarea name="text" value={fieldsState.text}/>,
          href  = content.href  && <input type="text" name="href" value={fieldsState.href}/>,
          //imageName = content.imageName && <input type="file" name="imageFile" accept="image/*"/>,
          related_content = content.related_content && (content.related_content.map(rel => 
                    <Section key={rel.ID} content={rel} name="related_content" readOnly={props.readOnly} handleChange={handleRelContentChange}/>
                )
          )
    return (
        <ManagedFieldSet readOnly={props.readOnly} handleChange={handleChange}>
            <input type="hidden" name="ID" value={content.ID}/>
            {title}
            {text}
            {href}
            {related_content}
        </ManagedFieldSet>
    )  
}

function ManagedFieldSet(props) {
    const modChildren =  React.Children.map(props.children, child => {
        if (child) {
            return React.cloneElement(child, {
                readOnly: props.readOnly,
                onChange: props.handleChange
            })
        }
    })
    return (
        <fieldset>{modChildren}</fieldset>
    )
}

function LabelAdder(props) {
    const comps = props.children.map((value, index) => {
        return <label for={value.id}>{props.labels[index]}{value}</label>
    })
    return comps
}

ReactDOM.render(
    <Admin/>,
    document.getElementById("root")
)