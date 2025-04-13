import { useNavigate } from 'react-router-dom';

const Button = ({ text = "Default Text", mode = "light", to = null }) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        if (to) {
            navigate(to);
        }
    };

    return(
        <>
        <button 
            className={`button-wrap ${mode === "dark" ? "button-dark" : "button-light"}`}
            onClick={handleClick}
        >
            {text}
        </button>
        </>
    )
}

export default Button;