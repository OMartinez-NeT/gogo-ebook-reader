import ReactPaginate from 'react-paginate';
import HighlightCard from './HighlightCard';
import "../examples.css";

const HighlightDisplayCurrent = ({ rendition, highlights, highlightCurrPageNum, setHighlightCurrPageNum, setHighlights }) => {
    const highlightCurrPerPage = 4;
    const highlightCurrPagesVisited = highlightCurrPageNum * highlightCurrPerPage;

    const displayCurrPgHighlight = highlights.slice(highlightCurrPagesVisited, highlightCurrPagesVisited + highlightCurrPerPage)
        .map((data, index) => (
            <li className='card-display' key={index}>
                <HighlightCard data={data} rendition={rendition} setHighlights={setHighlights} />
            </li>
        ))

    const highlightCurrPageCount = Math.ceil(highlights.length / highlightCurrPerPage);

    const handleHighlightCurrChangePage = ({ selected }) => {
        setHighlightCurrPageNum(selected);
    };

    return (
        <>
            {displayCurrPgHighlight}
            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={highlightCurrPageCount}
                forcePage={highlightCurrPageNum}
                onPageChange={handleHighlightCurrChangePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
            />
        </>
    )
};

export default HighlightDisplayCurrent;