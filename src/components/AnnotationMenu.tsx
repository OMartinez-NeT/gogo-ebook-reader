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

    const highlightAllPerPage = 4;
    const highlightAllPagesVisited = highlightAllPageNum * highlightAllPerPage;

    const highlightCurrPerPage = 4;
    const highlightCurrPagesVisited = highlightCurrPageNum * highlightCurrPerPage;

    const commentAllPerPage = 4;
    const commentAllPagesVisited = commentAllPageNum * commentAllPerPage;

    const commentCurrPerPage = 4;
    const commentCurrPagesVisited = commentCurrPageNum * commentCurrPerPage;

    const handleAnnotations = (allComments, currComments, allHighlights, currHighlights) => {
        setShowAllComment(allComments);
        setShowAllHighlight(allHighlights);
        setShowCurrHighlight(currHighlights);
        setShowCurrComment(currComments);
    }

    return (
        <>
            <div className='right-column-menu-container'>
                <button
                    className={showAllComment ? 'right-column-menu-btn active' : 'right-column-menu-btn'}
                    onClick={() => handleAnnotations(true, false, false, false)}>
                    All Comments
                </button>
                <button
                    className={showCurrComment ? 'right-column-menu-btn active' : 'right-column-menu-btn'}
                    onClick={() => handleAnnotations(false, true, false, false)}>
                    Current Comments
                </button>
                <button
                    className={showAllHighlight ? 'right-column-menu-btn active' : 'right-column-menu-btn'}
                    onClick={() => handleAnnotations(false, false, true, false)}>
                    All Highlights
                </button>
                <button
                    className={showCurrHighlight ? 'right-column-menu-btn active' : 'right-column-menu-btn'}
                    onClick={() => handleAnnotations(false, false, false, true)}>
                    Current Highlights
                </button>
            </div>
            {showAllHighlight && (
                <div>
                    <HighlightDisplayAll
                        rendition={rendition}
                        highlights={highlights}
                        highlightAllPageNum={highlightAllPageNum}
                        highlightAllPerPage={highlightAllPerPage}
                        highlightAllPagesVisited={highlightAllPagesVisited}
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
                        highlightCurrPerPage={highlightCurrPerPage}
                        highlightCurrPagesVisited={highlightCurrPagesVisited}
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
                        commentAllPerPage={commentAllPerPage}
                        commentAllPagesVisited={commentAllPagesVisited}
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
                        commentCurrPerPage={commentCurrPerPage}
                        commentCurrPagesVisited={commentCurrPagesVisited}
                        setCommentCurrPageNum={setCommentCurrPageNum}
                        setComments={setComments}
                    />
                </div>
            )}
        </>
    )
};

export default AnnotationMenu;