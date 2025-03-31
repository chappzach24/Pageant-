import { Link } from "react-router-dom";
const Navbar = () => {
    return(
        <div className="navbar-wrap position-fixed w-100">
            <div className="navbar-contain u-container">
                <div className="navbar-layout d-flex justify-content-between align-items-center">
                    <div className="navbar-logo">
                        <p className="u-text-light">LOGO</p>
                    </div>
                    <div className="navbar-links d-flex justify-content-center w-100 u-text-s">
                        <Link to={'/'} className="navbar-item u-text-light">HOME</Link>
                        <Link to={'/'} className="navbar-item u-text-light">HOW IT WORKS</Link>
                        <Link to={'/'} className="navbar-item u-text-light">TESTIMONIALS</Link>
                        <Link to={'/'} className="navbar-item u-text-light">FAQ</Link>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Navbar;