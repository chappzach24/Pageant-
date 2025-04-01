import StepsRow from "../global/StepsRow";

const StepsSection = () => {

    const stepsList = [
        {
            step: '1',
            header: "Set up your pageant",
            text: "Enter event details, customize scoring criteria, and invite judges—all in minutes.",
            side: 'left',
        },
        {
            step: '2',
            header: "Register Contestants & Judges",
            text: "Collect contestant applications online and assign judges effortlessly.",
            side: 'right',
        },
        {
            step: '3',
            header: "Score in Real Time",
            text: "Judges submit scores digitally, and results update instantly—no manual calculations needed.",
            side: 'left',
        },
        {
            step: '4',
            header: "Announce the Winners",
            text: "Generate accurate results instantly and share them live—stress-free and error-free!",
            side: 'right',
        }
    ]

    return(
        <>
        <div className="steps-wrap min-vh-100 u-section-space-m">
            <div className="steps-contain u-container">
                <div className="steps-layout d-flex flex-column u-gap-xl">
                    <div className="steps-header d-flex flex-column align-items-center u-gap-s w-100">
                        <h2 className="u-text-center">run your pageant in 4 simple steps</h2>
                        <p className="u-text-center u-text-dark">
                            From contestant registration to final results, our platform streamlines every step. No spreadsheets, no stress—just a seamless pageant experience.
                        </p>
                    </div>
                    <div className="steps-layout d-flex flex-column u-gap-m">
                        {stepsList.map((step, index) => (
                            <StepsRow 
                            key={index}
                            index={index}
                            step={step.step}
                            header={step.header}
                            text={step.text}
                            side={step.side}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default StepsSection;