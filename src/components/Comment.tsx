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
            rendition.off('selected', handleCommentData);
        }
    }, [rendition, book])

    return (
        <div>  
            <button className='btn' onClick={handleComment}>
                Comment
            </button>
            {showCommentPrompt && (
                <div>
                    <form className="comment-container" onSubmit={handleCommentPromptSubmit}>
                        <div>
                            <input
                                type="text"
                                id="commentInput"
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn" type="submit">Submit</button>
                        <button className="btn" onClick={handleCommentPromptCancel}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    )
};

export default Comment;