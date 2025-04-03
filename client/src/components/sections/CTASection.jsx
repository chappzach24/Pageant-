import Button from "../global/Button";

const CTASection = () => {
    return(
        <>
        <div className="cta-wrap min-vh-100 u-section-space-m position-relative d-flex flex-column justify-content-center">
            <div className="cta-image position-absolute w-100 h-100" style={{ top: '0', left: '0' }}>
                <img src="../public/hero_image.jpeg" className="h-100 w-100" style={{transform: 'scaleX(-1)' }} alt="" />
            </div>
            <div className="cta-contain u-container">
                <div className="cta-layout d-flex flex-column u-gap-m">
                    <div className="cta-header d-flex flex-column u-gap-xs">
                        <h2 
                            className="u-text-light"
                            style={{ maxWidth: '13em'}}
                        >READY TO SIMPLIFY YOUR PAGEANT PLANNING?
                        </h2>
                        <p style={{ maxWidth: '35em' }}>
                            Take the stress out of managing your event. From contestant registration to final scoring, we've got you covered.
                        </p>
                    </div>
                    <div className="button-contain">
                        <Button
                            text="Get started today"
                            mode="light"
                        />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default CTASection;