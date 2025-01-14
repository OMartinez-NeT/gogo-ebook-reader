import ReactPaginate from 'react-paginate';
import HighlightCard from './HighlightCard';
import "../examples.css";

const HighlightDisplayAll = ({ rendition, highlights, highlightAllPageNum, highlightAllPerPage, highlightAllPagesVisited, setHighlightAllPageNum, setHighlights }) => {   
    const displayAllHighlight = highlights.slice(highlightAllPagesVisited, highlightAllPagesVisited + highlightAllPerPage)
        .map((data, index) => (
            <li className='card-display' key={index}>
                <HighlightCard data={data} rendition={rendition} setHighlights={setHighlights} />
            </li>
        ))

    const highlightAllPageCount = Math.ceil(highlights.length / highlightAllPerPage);

    const handleHighlightAllChangePage = ({ selected }) => {
        setHighlightAllPageNum(selected);
    };

    return (
        <>
            {displayAllHighlight}
            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={highlightAllPageCount}
                forcePage={highlightAllPageNum}
                onPageChange={handleHighlightAllChangePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
            />
        </>
    )
};

export default HighlightDisplayAll;