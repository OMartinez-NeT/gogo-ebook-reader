import { useState, useEffect } from "react";
import "../examples.css";

const DisplayComments = ({ data, rendition, setComments }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newComment, setNewComment] = useState(data.comment);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const notes = document.querySelectorAll('.note');

        notes.forEach((note) => {
            if (note.scrollHeight > note.clientHeight) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        });
    }, [data.comment]);

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

        if (newComment !== data.comment) {
            setComments((prevData) => prevData.map((data) => {
                if (data.range == cfiRange) {
                    return { ...data, comment: newComment };
                }
                return data;
            }));
        }

        setIsEditing(false);
    }

    const handleEditCancel = () => {
        setIsEditing(false);
        setNewComment(data.comment); 
    }

    const handleDelete = (cfiRange) => {
        setComments((prevData) => prevData.filter((data) => data.range !== cfiRange));
        setMenuOpen(false);
    }

    return (
        <>
            <div className="passage-container">
                <div className="passage">
                    {data.text}
                </div>
            </div>
            {isEditing ? (
                <div>
                    <form onSubmit={(e) => handleEditSubmit(e, data.range)}>
                        <div>
                            <textarea
                                className="comment-input"
                                defaultValue={data.comment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                        </div>
                        <button className="btn" type="submit">Submit</button>
                        <button className="btn" type="button" onClick={handleEditCancel}>Cancel</button>
                    </form>
                </div>) : (
                <div className="comment-input-container">
                    <input type="checkbox" id={`showmore-${data.range}`} />
                    <div className="note">
                        {data.comment}
                    </div>
                    {showMore && (
                        <label htmlFor={`showmore-${data.range}`}>Show </label>
                    )}
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