import ReactPaginate from 'react-paginate';
import CommentCard from './CommentCard';
import "../examples.css";

const CommentDisplayAll = ({ rendition, comments, commentAllPageNum, setCommentAllPageNum, setComments }) => {
    const commentAllPerPage = 4;
    const commentAllPagesVisited = commentAllPageNum * commentAllPerPage;

    const displayAllComment = comments.slice(commentAllPagesVisited, commentAllPagesVisited + commentAllPerPage)
        .map((data, index) => (
            <li className='card-display' key={index}>
                <CommentCard data={data} rendition={rendition} setComments={setComments} />
            </li>
        ))

    const commentAllPageCount = Math.ceil(comments.length / commentAllPerPage);

    const handleCommentAllChangePage = ({ selected }) => {
        setCommentAllPageNum(selected);
    };

    return (
        <>
            {displayAllComment}
            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={commentAllPageCount}
                forcePage={commentAllPageNum}
                onPageChange={handleCommentAllChangePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
            />
        </>
    )
};

export default CommentDisplayAll;