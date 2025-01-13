import { useState } from "react";
import "../examples.css";

const DisplayComments = ({ data, rendition, setComments }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newComment, setNewComment] = useState('');

    const handleViewPage = () => {
        rendition.display(data.range);
        setMenuOpen(false);
    }

    const handleEdit = () => {
        setIsEditing(true);
        setMenuOpen(false);
    }

    const handleEditSubmit = (e, cfiRange) => {
        e.preventDefault();
        setComments((prevData) => prevData.map((data) => {
            if (data.range == cfiRange) {
                return { ...data, comment: newComment };
            }
            return data;
        }));
        setIsEditing(false);
    }

    const handleEditCancel = () => {
        setIsEditing(false);
    }

    const handleDelete = (cfiRange) => {
        setComments((prevData) => prevData.filter((data) => data.range !== cfiRange));
        setMenuOpen(false);
    }

    return (
        <>
            <div>{data.text}</div>
            {isEditing ? (
                <div>
                    <form onSubmit={(e) => handleEditSubmit(e, data.range)}>
                        <div>
                            <textarea
                                defaultValue={data.comment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                        </div>
                        <button className="btn" type="submit">Submit</button>
                        <button className="btn" type="button" onClick={handleEditCancel}>Cancel</button>
                    </form>
                </div>) : (<div>
                    {data.comment}
                </div>
            )}
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
                    <li onClick={handleEdit}>
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