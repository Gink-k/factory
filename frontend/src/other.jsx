import React from "react"
import ReactDOM from "react-dom"
import {Logo} from "./base"

function Other(props) {
    React.useEffect(() => {
        setTimeout(() => window.location.href = "/", 3000)
    })
    return (
        <div>
            <Logo/>
            <div className="not-exsist-msg">Просим прощения, но такой страницы не существует. Вы будете переадресованы на главную страницу.</div>
        </div>
    )
}

ReactDOM.render(
    <Other/>,
    document.getElementById("root")
)