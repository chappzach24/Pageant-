import Navbar from "../components/global/Navbar";
import GridGuide from "../components/GridGuide";
import Button from "../components/global/Button";
import BenefitsSection from "../components/sections/BenefitsSection";
import StepsSection from "../components/sections/StepsSection";
import FAQSection from "../components/sections/FAQSection";
import CTASection from "../components/sections/CTASection";
import Footer from "../components/sections/Footer";

const Home = () => {

    return (
        <>
            <Navbar />
            <GridGuide />
            {/* Hero Section */}
            <div className="hero-wrap position-relative vh-100 vw-100">
                <div className="hero-img position-absolute h-100 w-100">
                    <img src="../public/hero_image.jpeg" className="h-100 w-100" style={{transform: 'scaleX(-1)' }} alt="" />
                </div>
                <div className="hero-contain u-container d-flex flex-column justify-content-center h-100">
                    <div className="hero-layout d-flex flex-column u-gap-m">
                        <div className="hero-header d-flex flex-column u-gap-xs">
                            <h1>Run Your Pageant With Confidence</h1>
                            <p>No more judging delays or messy spreadsheets. Get real-time scoring, seamless contestant management, and stress-free results—all in one place.</p>
                        </div>
                        <div className="button-contain">
                            <Button text="Simplify My Pageant" mode="light" to="/login" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefit Section */}
            <BenefitsSection />

            {/* Steps Section */}
            <StepsSection />

            {/* FAQ Section */}
            <FAQSection />

            {/* CTA Section */}
            <CTASection />

            {/* Footer */}
            <Footer />
        </>
    )
}

export default Home;