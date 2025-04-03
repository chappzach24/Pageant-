
import FAQQuestion from "../global/FAQQuestion";

const FAQSection = () => {

    const qna = [
        {
            question: "How does your software simplify pageant management?",
            answer: "Our software streamlines every aspect of pageant management by automating contestant registration, judge assignments, scoring, and results. It eliminates the need for manual calculations, ensures accurate tabulations, and provides an easy-to-use dashboard for managing your event from start to finish."
        },
        {
            question: "Can I customize the scoring system for my pageant?",
            answer: "Yes! You can set up custom score categories, weight criteria, and adjust the judging process to match your event's needs."
        },
        {
            question: "Is the software mobile-friendly?",
            answer: "Yes! Our software is fully responsive and works seamlessly on mobile devices, tablets, and desktops. Contestants, judges, and organizers can access their accounts, submit scores, and track event progress from any device with an internet connection."
        },
        {
            question: "Do you offer real-time scoring and results?",
            answer: "Absolutely! Our software updates scores in real time, allowing judges to enter scores instantly and organizers to see rankings as they update. You can display live leaderboards and final results immediately after judging is complete."
        },
        {
            question: "How do contestants register for my pageant?",
            answer: "Contestants can easily register online through a custom registration link. They can fill out their personal details, upload photos, and pay entry fees (if applicable). All contestant data is stored securely, making it easy for organizers to review and manage entries."
        },
    ]

    return(
        <>
        <div className="faq-wrap min-vh-100 u-bg-secondary u-section-space-m">
            <div className="faq-contain u-container">
                <div className="faq-layout d-flex flex-column u-gap-xl">
                    <div className="faq-header d-flex flex-column align-items-center u-gap-s w-100">
                        <h2 className="u-text-light u-text-center">Got Questions? We've got answers</h2>
                        <p className="u-text-center">Everything you need to know about streamlining your pageant management—right here.</p>
                    </div>
                    <div className="faq-question-layout d-flex flex-column" style={{ gap: 'var(--size--2-5rem)'}}>
                        {qna.map((question, index) => (
                            <FAQQuestion 
                                key={index}
                                question={question.question}
                                answer={question.answer}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default FAQSection;