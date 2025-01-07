import React, { useEffect, useState, useCallback } from "react";
import ReactPaginate from 'react-paginate';
import ePub from "epubjs";
//import "./App.css";
import "./examples.css";

function App() {
  const [book, setBook] = useState<any>(null);
  const [rendition, setRendition] = useState<any>(null);
  const [toc, setToc] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [showPrev, setShowPrev] = useState(true);
  const [showNext, setShowNext] = useState(true);
  const [isHighlightEnabled, setHighlightEnabled] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const [isCommentEnabled, setCommentEnabled] = useState(false);
  const [comments, setComments] = useState([]);
  const [highlightPageNum, setHighlightPageNum] = useState(0);
  const [commentPageNum, setCommentPageNum] = useState(0);
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  const highlightPerPage = 5;
  const highlightPagesVisited = highlightPageNum * highlightPerPage;

  const commentPerPage = 5;
  const commentPagesVisited = commentPageNum * commentPerPage;

  useEffect(() => {
    const bookUrl = ePub("./src/Data/example.epub");
    setBook(bookUrl);
  }, []);

  useEffect(() => {
    if (!book) return;

    const renderedBook = book.renderTo("viewer", {
      width: "100%",
      height: 700,
      allowScriptedContent: true,
      spread: "always"
    });

    renderedBook.display();
    setRendition(renderedBook);

    book.ready.then(() => {
      renderedBook.on("relocated", (location) => {
        if (location.atEnd) {
          setShowNext(false);
        } else {
          setShowNext(true);
        }

        if (location.atStart) {
          setShowPrev(false);
        } else {
          setShowPrev(true);
        }
      });

      book.loaded.navigation.then((nav) => {
        const items = nav.toc.map((item) => {
          return {
            label: item.label,
            href: item.href
          };
        });

        setToc(items);
      });
    })

    return () => {
      renderedBook.destroy();
    };
  }, [book])

  //---------------- Navigation
  const handleSectionChange = (e) => {
    const url = e.target.value;
    rendition.display(url);
    setSelectedSection(url);
  };

  const handlePrev = () => {
    rendition.prev();
  }

  const handleNext = () => {
    rendition.next();
  }

  const displayTOC = toc.map((section, index) => (
    <option key={index} value={section.href}>
      {section.label}
    </option>
  ))

  //---------------- Highlights
  const handleHighlight = () => {
    if (isHighlightEnabled) {
      rendition.off('selected', handleHighlightingText);
      rendition.off('selected', handleHighlightData);
      setHighlightEnabled(false);
    } else {
      rendition.on('selected', handleHighlightingText);
      rendition.on('selected', handleHighlightData);
      setHighlightEnabled(true);
    }
  };

  const handleHighlightingText = useCallback((cfiRange, contents) => {
    rendition.annotations.highlight(cfiRange);
    contents.window.getSelection().removeAllRanges();
  }, [rendition]);

  const handleHighlightData = useCallback(async (cfiRange) => {
    const range = await book.getRange(cfiRange);

    if (range) {
      const text = range.toString();

      const data = {
        range: cfiRange,
        text: text
      }

      setHighlights((prevData) => [...prevData, data]);
    }

  }, [book])

  const handleRemoveHighlight = (cfiRange) => {
    rendition.annotations.remove(cfiRange, 'highlight');
    setHighlights((prevData) => prevData.filter((data) => data.range !== cfiRange));
  };

  const displayHighlight = highlights.slice(highlightPagesVisited, highlightPagesVisited + highlightPerPage)
    .map((data, index) => (
      <li className='highlight-display' key={index}>
        <span>{data.text}</span>
        <br />
        <br />
        <button className='btn' onClick={() => rendition.display(data.range)}>Go to Page</button>
        <button className='btn' onClick={() => handleRemoveHighlight(data.range)}>Delete</button>
      </li>
    ))

  const highlightPageCount = Math.ceil(highlights.length / highlightPerPage);

  const handleHighlightChangePage = ({ selected }) => {
    setHighlightPageNum(selected);
  };

  //------------------ Comments

  const handleComment = () => {
    if (isCommentEnabled) {
      rendition.off('selected', handleCommentData);
      setCommentEnabled(false);
    } else {
      rendition.on('selected', handleCommentData);
      setCommentEnabled(true);
    }
  }

  const handleCommentData = useCallback(async (cfiRange) => {
    const comment = prompt('what would you like to comment');
    const range = await book.getRange(cfiRange);

    if (range) {
      const text = range.toString();

      const data = {
        range: cfiRange,
        text: text,
        comment: comment
      }

      setComments((prevData) => [...prevData, data]);
    }

  }, [book])

  const handleRemoveComment = (cfiRange) => {
    setComments((prevData) => prevData.filter((data) => data.range !== cfiRange));
  }

  const displayComment = comments.slice(commentPagesVisited, commentPagesVisited + commentPerPage)
    .map((data, index) => (
      <li className='highlight-display' key={index}>
        <span>{data.text}</span>
        <br />
        <br />
        <span>{data.comment}</span>
        <br />
        <br />
        <button className='btn' onClick={() => rendition.display(data.range)}>Go to Page</button>
        <button className='btn' onClick={() => handleRemoveComment(data.range)}>Delete</button>
      </li>
    ))

  const commentPageCount = Math.ceil(comments.length / commentPerPage);

  const handleCommentChangePage = ({ selected }) => {
    setCommentPageNum(selected);
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='right-column'>
        <select className='toc' value={selectedSection} onChange={handleSectionChange}>
          {displayTOC}
        </select>
          {displayHighlight}
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={highlightPageCount}
            onPageChange={handleHighlightChangePage}
            containerClassName={"paginationBttns"}
            previousLinkClassName={"previousBttn"}
            nextLinkClassName={"nextBttn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
          />
          {displayComment}
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={commentPageCount}
            onPageChange={handleCommentChangePage}
            containerClassName={"paginationBttns"}
            previousLinkClassName={"previousBttn"}
            nextLinkClassName={"nextBttn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
          />
      </div>
      <div className='left-column'>
        <div className='top-menu'>
          <button
            className={isHighlightEnabled ? 'btn on' : 'btn off'} onClick={handleHighlight}>
            {isHighlightEnabled ? 'Highlights: On' : 'Highlights: Off'}
          </button>
          <button className={isCommentEnabled ? 'btn on' : 'btn off'} onClick={handleComment}>
            {isCommentEnabled ? 'Comment: On' : 'Comment: Off'}
          </button>
        </div>
        <div className='content'>
          {showPrev && (<a className="arrow" onClick={handlePrev}>‹</a>)}
          <div id='viewer'></div>
          {showNext && (<a className="arrow" onClick={handleNext}>›</a>)}
        </div>
      </div>
    </>
  )
}

export default App;
