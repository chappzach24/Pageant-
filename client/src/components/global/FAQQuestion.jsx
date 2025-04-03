import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const FAQQuestion = ({ question, answer}) => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        <div className="faq-question-container d-flex flex-column u-gap-m">
            <div className="faq-question">
                <h5 className="u-text-light">{question}</h5>  
                <FontAwesomeIcon icon={isOpen ? faMinus : faPlus} onClick={() => setIsOpen(!isOpen)} />
                
            </div>
            <div className={`faq-answer ${isOpen ? "open" : ""}`}>
                <p>{answer}</p>
            </div>
            <div className="border-container">
                <div className="grid-border"></div>
            </div>
        </div>
        </>
    )
}

export default FAQQuestion