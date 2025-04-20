    

const GridGuide = () => {
    const columns = Array(12).fill(null);
    return(
        <>
        <div className="guide-wrap position-fixed w-100">
            <div className="guide-content u-container">
                <div className="guide-layout u-grid-custom">
                    {columns.map((_, index) => (
                        <div key={index} className="guide-column d-flex justify-content-center align-items-end vh-100">
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    )
    
}

export default GridGuide;