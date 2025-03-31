import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons'

const BenefitCard = ({ header = "Default header", text = "default text", svg = faClipboardCheck }) => {
    return(
        <>
        <div className="benefit-card-wrap">
            <div className="benefit-card-content d-flex flex-column u-gap-s align-items-start">
                <FontAwesomeIcon className='benefit-card-icon' icon={svg} />
                <div className="benefit-card-text d-flex flex-column u-gap-xs">
                    <h5>{header}</h5>
                    <p className='u-text-dark'>{text}</p>  
                </div>
            </div>
        </div>
        </>
    )
}

export default BenefitCard;