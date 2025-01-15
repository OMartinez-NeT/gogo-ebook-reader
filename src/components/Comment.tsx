import { useState, useCallback } from "react";
import "../examples.css";

const Comment = ({ rendition, book, setComments }) => {
    const [range, setRange] = useState('');
    const [text, setText] = useState('');
    const [page, setPage] = useState('');
    const [showCommentPrompt, setShowCommentPrompt] = useState(false);
    const [commentInput, setCommentInput] = useState('');

    const handleComment = () => {
        rendition.on('selected', handleCommentData);
    }

    const handleCommentPromptSubmit = (e) => {
        e.preventDefault();
        setShowCommentPrompt(false);

        const data = {
            range: range,
            text: text,
            comment: commentInput,
            page: page,
        }

        setComments((prevData) => [...prevData, data]);
    }

    const handleCommentPromptCancel = () => {
        setShowCommentPrompt(false);
        rendition.off('selected', handleCommentData);
    }

    const handleCommentData = useCallback(async (cfiRange) => {
        setShowCommentPrompt(true);
        const bookRange = await book.getRange(cfiRange);

        if (bookRange) {
            setText(bookRange.toString());
            setPage(rendition.location.start.displayed.page);
            setRange(cfiRange);
        }

        rendition.off('selected', handleCommentData);
        setCommentInput('');
    }, [rendition, book])

    return (
        <div className="comment-menu-container">
            <button className='btn' onClick={handleComment}>
                Comment
            </button>
            {showCommentPrompt && (
                <div>
                    <form className="edit-comment-form" onSubmit={handleCommentPromptSubmit}>
                        <div>
                            <textarea
                                id="commentInput"
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                            />
                        </div>
                        <button className="btn" type="submit">Submit</button>
                        <button className="btn" type="button" onClick={handleCommentPromptCancel}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    )
};

export default Comment;