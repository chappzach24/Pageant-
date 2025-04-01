import { useEffect, useRef, useState } from "react";

const StepsRow = ({ step, header, text, side, index }) => {

    const stepRef = useRef(null);
    const [circleProgress, setCircleProgress] = useState([]);
    const [lineProgress, setLineProgress] = useState([]);
    const [textOpacity, setTextOpacity] = useState([])

    useEffect(() => {
        const handleScroll = () => {
            const steps = document.querySelectorAll(".step-item");
            const newCircleProgress = [];
            const newLineProgress = [];
            const newTextOpacity = [];
    
            steps.forEach((step, index) => {
                const rect = step.getBoundingClientRect();
                const windowHeight = window.innerHeight;
    
                // Calculate progress based on viewport position
                let progress = (windowHeight - rect.top) / (windowHeight * 0.6);
                progress = Math.min(Math.max(progress, 0), 1.35); // Clamp between 0 and 1
    
                // For the circle: It fills immediately with the scroll progress
                newCircleProgress[index] = Math.min(progress * 1.95, 1);
    
                // For the line: Add a lag (e.g., -0.4) and use a multiplier to make it fill slowly
                let lineProgress = Math.max(progress - 0.5, 0);  // Lag the line by 0.4 to start filling later
                
                // Gradually fill the line with a slow rate using a smaller multiplier
                lineProgress = Math.min(lineProgress * 1.2, 1); // Slow fill with a smaller multiplier, and max at 1
    
                newLineProgress[index] = lineProgress;

                const textOpacity = Math.min(Math.max(progress + 0.075, 0), 1); // Fade in the text as circle fills
                newTextOpacity[index] = textOpacity;
            });
    
            setCircleProgress(newCircleProgress);
            setLineProgress(newLineProgress);
            setTextOpacity(newTextOpacity);
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    
    

    return(
        <>
            <div ref={stepRef} className={`step-item ${side} w-100`}>
                <div className="step-content d-flex flex-column u-gap-xxs">
                    <p className="u-text-brand u-text-xs u-weight-semi" style={{ opacity: textOpacity[index] }}>
                        Step {step}
                    </p>
                    <div className="step-description d-flex flex-column u-gap-xs">
                        <h5 style={{ opacity: textOpacity[index] }}>{header}</h5>
                        <p className="u-text-dark" style={{ opacity: textOpacity[index] }}>
                            {text}
                        </p> 
                    </div>
                </div>
                <div className="step-progress d-flex flex-column align-items-center u-gap-m">
                <div
                    className="step-circle"
                    style={{
                        background:`linear-gradient(to bottom, var(--brand-color) ${circleProgress[index] * 100}%, var(--secondary-color) 0%)`
                    }}
                ></div>
                    <div
                    className="step-line"
                    style={{
                        background: `linear-gradient(to bottom, var(--brand-color) ${lineProgress[index] * 100}%, var(--secondary-color) 0%)`, // Gradual fill effect
                    }}
                ></div>
                </div>
            </div>
           
        </>
    )
}

export default StepsRow;