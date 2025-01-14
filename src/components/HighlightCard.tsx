import { useState } from "react";
import "../examples.css";

const DisplayHighlights = ({ data, rendition, setHighlights }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleViewPage = () => {
        rendition.display(data.range);
        setMenuOpen(false);
    }

    const handleDelete = (cfiRange) => {
        rendition.annotations.remove(cfiRange, 'highlight');
        setHighlights((prevData) => prevData.filter((data) => data.range !== cfiRange));
        setMenuOpen(false);
    }

    return (
        <>
            <div>{data.text}</div>
            <div className="card-menu-container">
                <div className="card-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul className={menuOpen ? "open" : ""}>
                    <li onClick={handleViewPage}>
                        View Page {data.page}
                    </li>
                    <li onClick={() => handleDelete(data.range)}>
                        Delete
                    </li>
                </ul>
            </div>
        </>
    )
};

export default DisplayHighlights;