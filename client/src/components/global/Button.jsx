
const Button = ({ text = "Default Text", mode = "light" }) => {

    return(
        <>
        <button className={`button-wrap ${mode === "dark" ? "button-dark" : "button-light"}`}>
            {text}
        </button>
        </>
    )
}

export default Button;