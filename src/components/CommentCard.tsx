import { useState } from "react";
import "../examples.css";

const DisplayComments = ({ data, rendition, setComments }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleViewPage = () => {
        rendition.display(data.range);
        setMenuOpen(false);
    }

    const handleEdit = (cfiRange) => {
        setComments((prevData) => prevData.filter((data) => {
            if (data.range == cfiRange) {
                //do something 
            }
        }));
    }

    const handleDelete = (cfiRange) => {
        setComments((prevData) => prevData.filter((data) => data.range !== cfiRange));
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
                    <li onClick={() => handleEdit(data.range)}>
                        Edit
                    </li>
                    <li onClick={() => handleDelete(data.range)}>
                        Delete
                    </li>
                </ul>
            </div>
        </>
    )
};

export default DisplayComments;