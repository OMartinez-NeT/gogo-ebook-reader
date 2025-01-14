import { useState } from "react";
import HighlightDisplayAll from "./HighlightDisplayAll";
import HighlightDisplayCurrent from "./HighlightDisplayCurrent";
import CommentDisplayAll from "./CommentDisplayAll";
import CommentDisplayCurrent from "./CommentDisplayCurrent";
import "../examples.css";

const AnnotationMenu = ({ rendition, highlights, comments, currentPage, 
    highlightAllPageNum, highlightCurrPageNum, commentAllPageNum, 
    commentCurrPageNum, setHighlightAllPageNum, setHighlightCurrPageNum, 
    setCommentAllPageNum, setCommentCurrPageNum, setHighlights, setComments
}) => {
    const [showAllHighlight, setShowAllHighlight] = useState(false);
    const [showAllComment, setShowAllComment] = useState(true);
    const [showCurrHighlight, setShowCurrHighlight] = useState(false);
    const [showCurrComment, setShowCurrComment] = useState(false);

    const handleAnnotations = (allComments, currComments, allHighlights, currHighlights) => {
        setShowAllComment(allComments);
        setShowAllHighlight(allHighlights);
        setShowCurrHighlight(currHighlights);
        setShowCurrComment(currComments);
    }

    return (
        <>
            <div className='annotation-menu-container'>
                <button
                    className={showAllComment ? 'annotation-menu-btn active' : 'annotation-menu-btn'}
                    onClick={() => handleAnnotations(true, false, false, false)}>
                    All Comments
                </button>
                <button
                    className={showCurrComment ? 'annotation-menu-btn active' : 'annotation-menu-btn'}
                    onClick={() => handleAnnotations(false, true, false, false)}>
                    Page Comments
                </button>
                <button
                    className={showAllHighlight ? 'annotation-menu-btn active' : 'annotation-menu-btn'}
                    onClick={() => handleAnnotations(false, false, true, false)}>
                    All Highlights
                </button>
                <button
                    className={showCurrHighlight ? 'annotation-menu-btn active' : 'annotation-menu-btn'}
                    onClick={() => handleAnnotations(false, false, false, true)}>
                    Page Highlights
                </button>
            </div>
            {showAllHighlight && (
                <div>
                    <HighlightDisplayAll
                        rendition={rendition}
                        highlights={highlights}
                        highlightAllPageNum={highlightAllPageNum}
                        setHighlightAllPageNum={setHighlightAllPageNum}
                        setHighlights={setHighlights}
                    />
                </div>
            )}
            {showCurrHighlight && (
                <div>
                    <HighlightDisplayCurrent
                        rendition={rendition}
                        highlights={highlights.filter((data) => data.page == currentPage)}
                        highlightCurrPageNum={highlightCurrPageNum}
                        setHighlightCurrPageNum={setHighlightCurrPageNum}
                        setHighlights={setHighlights}
                    />
                </div>
            )}
            {showAllComment && (
                <div>
                    <CommentDisplayAll
                        rendition={rendition}
                        comments={comments}
                        commentAllPageNum={commentAllPageNum}
                        setCommentAllPageNum={setCommentAllPageNum}
                        setComments={setComments}
                    />
                </div>
            )}
            {showCurrComment && (
                <div>
                    <CommentDisplayCurrent
                        rendition={rendition}
                        comments={comments.filter((data) => data.page == currentPage)}
                        commentCurrPageNum={commentCurrPageNum}
                        setCommentCurrPageNum={setCommentCurrPageNum}
                        setComments={setComments}
                    />
                </div>
            )}
        </>
    )
};

export default AnnotationMenu;