import React, { useEffect, useState, useCallback, useRef } from "react";
import "../examples.css";

const DisplayHighlights = ({ data, index, rendition, handleRemoveHighlight }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <li className='card-display' key={index}>
                <div>{data.text}</div>
                <div className="menu-container">
                    <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <ul className={menuOpen ? "open" : ""}>
                        <li onClick={() => rendition.display(data.range)}>
                            View Page {data.page}
                        </li>
                        <li onClick={() => handleRemoveHighlight(data.range)}>
                            Delete
                        </li>
                    </ul>
                </div>
            </li>
        </>
    )
};

export default DisplayHighlights;