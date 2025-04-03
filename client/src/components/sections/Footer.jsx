import { Link } from "react-router-dom";

const Footer = () => {
    return(
        <>
        <div className="footer-wrap u-section-space-m" style={{ paddingBottom: 'var(--size--2rem)'}}>
            <div className="footer-contain u-container">
                <div className="footer-layout d-flex flex-column u-gap-xl">
                    <div className="footer-grid">
                        <div className="footer-logo">
                            <p className="u-text-dark u-text-l">Logo</p>
                        </div>
                        <div className="footer-content d-flex flex-column u-gap-xl">
                            <div className="footer-top-nav d-flex flex-row u-gap-xl justify-content-between u-text-center">
                                <div className="footer-quick-links d-flex flex-column u-gap-m ">
                                    <h5>QUICK LINKS</h5>
                                    <Link to={'/'} className="u-text-dark footer-link">Contestant Sign Up</Link>
                                    <Link to={'/'} className="u-text-dark footer-link">Create Pageant</Link>
                                    <Link to={'/'} className="u-text-dark footer-link">Admin Portal</Link>
                                    <Link to={'/'} className="u-text-dark footer-link">View Pageant</Link>
                                </div>
                                <div className="footer-quick-links d-flex flex-column u-gap-m ">
                                    <h5>NAVIGATION</h5>
                                    <Link to={'/'} className="u-text-dark footer-link">HOME</Link>
                                    <Link to={'/'} className="u-text-dark footer-link">HOW IT WORKS</Link>
                                    <Link to={'/'} className="u-text-dark footer-link">TESTIMONIALS</Link>
                                    <Link to={'/'} className="u-text-dark footer-link">FAQ</Link>
                                </div>
                            </div>
                            <div className="footer-bottom-nav d-flex flex-column u-gap-xs">
                                <div className="footer-contact-header d-flex flex-column u-gap-xs">
                                    <h2>get in touch</h2>
                                    <div className="footer-contact-line w-100" style={{ borderBottom: '2px solid var(--secondary-color)', height: '0'}}></div>
                                </div>
                                <div className="footer-contact-info d-flex flex-column u-gap-xs">
                                    <p className="u-text-dark">(444)-444-4444</p>
                                    <p className="u-text-dark">email@email.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-additional-info d-flex flex-row justify-content-around">
                        <p className="u-text-dark u-text-xs">© 2024 by Company Name</p>
                        <Link className="u-text-dark u-text-xs">Privacy Policy</Link>
                        <Link className="u-text-dark u-text-xs">Terms & Conditions</Link>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Footer;