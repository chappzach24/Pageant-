import BenefitCard from "../global/BenefitCard";

const BenefitsSection = () => {

    const benefitsArray = [
        {
            icon: 'faClipboardCheck',
            header: 'Seamless Contestant Registration',
            text: 'Effortlessly collect contestant applications online, track information, and keep everything organized.'
        },
        {
            icon: 'faClipboardCheck',
            header: 'Real Time Scoring',
            text: 'Judges submit scores instantly, and results update in real time—no more manual tabulations or delays.'
        },
        {
            icon: 'faClipboardCheck',
            header: 'Automated Tabulation',
            text: 'Effortlessly collect contestant applications online, track information, and keep everything organized.'
        },
        {
            icon: 'faClipboardCheck',
            header: 'Contestant & Judge Management',
            text: 'Easily add, edit, and manage contestants and judges in one organized system.'
        },
        {
            icon: 'faClipboardCheck',
            header: 'Customizable Scoring Criteria',
            text: 'Adjust categories, weights, and criteria to fit any pageant format or scoring method.'
        },
        {
            icon: 'faClipboardCheck',
            header: 'Instant Winner Announcements',
            text: 'Generate results instantly and display them live—no more waiting for calculations.'
        },
    ]

    return(
        <>
        <div className="benefits-wrap min-vh-100 u-section-space-m">
            <div className="benefits-contain u-container">
                <div className="benefits-layout d-flex flex-column align-items-center u-gap-l">
                    <h2 className="u-text-center">Everything you need for a seamless pageant</h2>
                    <div className="benefits-grid">
                        {benefitsArray.map((benefit, index) => (
                            <BenefitCard 
                            key={index} 
                            icon={benefit.icon} 
                            header={benefit.header} 
                            text={benefit.text} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default BenefitsSection;