import ReactPaginate from 'react-paginate';
import CommentCard from './CommentCard';
import "../examples.css";

const CommentDisplayCurrent = ({ rendition, comments, commentCurrPerPage, commentCurrPagesVisited, setCommentCurrPageNum, setComments }) => {
    const displayCurrComment = comments.slice(commentCurrPagesVisited, commentCurrPagesVisited + commentCurrPerPage)
        .map((data, index) => (
            <li className='card-display' key={index}>
                <CommentCard data={data} rendition={rendition} setComments={setComments} />
            </li>
        ))

    const commentCurrPageCount = Math.ceil(comments.length / commentCurrPerPage);

    const handleCommentCurrChangePage = ({ selected }) => {
        setCommentCurrPageNum(selected);
    };
    return (
        <>
            {displayCurrComment}
            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={commentCurrPageCount}
                onPageChange={handleCommentCurrChangePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
            />
        </>
    )
};

export default CommentDisplayCurrent;