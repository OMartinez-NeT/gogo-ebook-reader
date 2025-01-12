import React, { useEffect, useState, useCallback, useRef } from "react";
import "../examples.css";

const DisplayComments = ({ data, rendition, handleRemoveComment }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleViewPage = () => {
        rendition.display(data.range);
        setMenuOpen(false);
    }

    const handleDelete = () => {
        handleRemoveComment(data.range);
        setMenuOpen(false);
    }

    return (
        <>
            <div>{data.text}</div>
            <div>{data.comment}</div>
            <div className="menu-container">
                <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul className={menuOpen ? "open" : ""}>
                    <li onClick={handleViewPage}>
                        View Page {data.page}
                    </li>
                    <li>
                        Edit
                    </li>
                    <li onClick={handleDelete}>
                        Delete
                    </li>
                </ul>
            </div>
        </>
    )
};

export default DisplayComments;