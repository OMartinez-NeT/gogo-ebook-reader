import React, { useEffect, useState, useCallback, useRef } from "react";
import { TwitterPicker } from 'react-color';
import ReactPaginate from 'react-paginate';
import HighlightCard from './components/HighlightCard';
import CommentCard from './components/CommentCard';
import ePub from "epubjs";
import "./examples.css";

function App() {
  const [book, setBook] = useState<any>(null);
  const [rendition, setRendition] = useState<any>(null);
  const [toc, setToc] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [showPrev, setShowPrev] = useState(true);
  const [showNext, setShowNext] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [highlights, setHighlights] = useState([]);
  const [comments, setComments] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCommentPrompt, setShowCommentPrompt] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const [highlightAllPageNum, setHighlightAllPageNum] = useState(0);
  const [commentAllPageNum, setCommentAllPageNum] = useState(0);
  const [highlightCurrPageNum, setHighlightCurrPageNum] = useState(0);
  const [commentCurrPageNum, setCommentCurrPageNum] = useState(0);
  const [showAllHighlight, setShowAllHighlight] = useState(false);
  const [showAllComment, setShowAllComment] = useState(true);
  const [showCurrHighlight, setShowCurrHighlight] = useState(false);
  const [showCurrComment, setShowCurrComment] = useState(false);

  const highlightColor = useRef('yellow');

  const highlightAllPerPage = 4;
  const highlightAllPagesVisited = highlightAllPageNum * highlightAllPerPage;

  const highlightCurrPerPage = 4;
  const highlightCurrPagesVisited = highlightCurrPageNum * highlightCurrPerPage;

  const commentAllPerPage = 4;
  const commentAllPagesVisited = commentAllPageNum * commentAllPerPage;

  const commentCurrPerPage = 4;
  const commentCurrPagesVisited = commentCurrPageNum * commentCurrPerPage;

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
    setHighlightCurrPageNum(0);
    setCommentCurrPageNum(0);

    setTimeout(() => {
      const page = rendition.location.start.displayed.page;
      setCurrentPage(page);
    }, 100);
  };

  const handlePrev = () => {
    rendition.prev();
    setCurrentPage(currentPage - 1);
    setHighlightCurrPageNum(0);
    setCommentCurrPageNum(0);
  }

  const handleNext = () => {
    rendition.next();
    setCurrentPage(currentPage + 1);
    setHighlightCurrPageNum(0);
    setCommentCurrPageNum(0);
  }

  const displayTOC = toc.map((section, index) => (
    <option key={index} value={section.href}>
      {section.label}
    </option>
  ))

  //---------------- Highlights
  const handleHighlight = () => {
    rendition.on('selected', handleHighlightData);
  };

  const handleHighlightData = useCallback(async (cfiRange, contents) => {
    rendition.annotations.add("highlight", cfiRange, {}, {}, "hl", {
      "fill": highlightColor.current,
      "fill-opacity": "0.3",
      "mix-blend-mode": "multiply"
    });

    const range = await book.getRange(cfiRange);
    const page = rendition.location.start.displayed.page;

    if (range) {
      const text = range.toString();

      const data = {
        range: cfiRange,
        text: text,
        page: page
      }

      setHighlights((prevData) => [...prevData, data]);
    }

    contents.window.getSelection().removeAllRanges();
    rendition.off('selected', handleHighlightData);
  }, [rendition, book]);

  const handleRemoveHighlight = (cfiRange) => {
    rendition.annotations.remove(cfiRange, 'highlight');
    setHighlights((prevData) => prevData.filter((data) => data.range !== cfiRange));
  };

  const displayAllHighlight = highlights.slice(highlightAllPagesVisited, highlightAllPagesVisited + highlightAllPerPage)
    .map((data, index) => (
      <li className='card-display' key={index}>
        <HighlightCard data={data} rendition={rendition} handleRemoveHighlight={handleRemoveHighlight} />
      </li>
    ))

  const highlightAllPageCount = Math.ceil(highlights.length / highlightAllPerPage);

  const handleHighlightAllChangePage = ({ selected }) => {
    setHighlightAllPageNum(selected);
  };

  const displayCurrPgHighlight = highlights.filter((data) => data.page == currentPage).slice(highlightCurrPagesVisited, highlightCurrPagesVisited + highlightCurrPerPage)
    .map((data, index) => (
      <li className='card-display' key={index}>
        <HighlightCard data={data} rendition={rendition} handleRemoveHighlight={handleRemoveHighlight} />
      </li>
    ))

  const highlightCurrPageCount = Math.ceil(highlights.filter((data) => data.page == currentPage).length / highlightCurrPerPage);

  const handleHighlightCurrChangePage = ({ selected }) => {
    setHighlightCurrPageNum(selected);
  };

  const handleHighlightColorChange = (color) => {
    highlightColor.current = color.hex;
    handleHighlight();
    setShowColorPicker(false);
  }

  const handleShowColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  }

  //------------------ Comments

  const [rang, setRange] = useState('');
  const [text, setText] = useState('');
  const [PgNum, setPgNum] = useState('');

  const handleComment = () => {
    rendition.on('selected', handleCommentData);
  }

  const handleCommentPromptSubmit = (e) => {
    e.preventDefault();
    setShowCommentPrompt(false);

    const data = {
      range: rang,
      text: text,
      comment: commentInput,
      page: PgNum,
    }

    setComments((prevData) => [...prevData, data]);
  }

  const handleCommentPromptCancel = () => {
    setShowCommentPrompt(false);
    rendition.off('selected', handleCommentData);
  }

  const handleCommentData = useCallback(async (cfiRange) => {
    setShowCommentPrompt(true);
    const range = await book.getRange(cfiRange);

    if (range) {
      const text = range.toString();
      setText(text);
      const page = rendition.location.start.displayed.page;
      setPgNum(page);
      setRange(cfiRange);
      rendition.off('selected', handleCommentData);
    }
  }, [rendition, book])

  const handleEditComment = (cfiRange) => {
    setComments((prevData) => prevData.filter((data) => {
      if (data.range == cfiRange) {
        //do something 
      }
    }));
  }

  const handleRemoveComment = (cfiRange) => {
    setComments((prevData) => prevData.filter((data) => data.range !== cfiRange));
  }

  const displayAllComment = comments.slice(commentAllPagesVisited, commentAllPagesVisited + commentAllPerPage)
    .map((data, index) => (
      <li className='card-display' key={index}>
        <CommentCard data={data} rendition={rendition} handleRemoveComment={handleRemoveComment} />
      </li>
    ))

  const commentAllPageCount = Math.ceil(comments.length / commentAllPerPage);

  const handleCommentAllChangePage = ({ selected }) => {
    setCommentAllPageNum(selected);
  };

  const displayCurrComment = comments.filter((data) => data.page == currentPage).slice(commentCurrPagesVisited, commentCurrPagesVisited + commentCurrPerPage)
    .map((data, index) => (
      <li className='card-display' key={index}>
        <CommentCard data={data} rendition={rendition} handleRemoveComment={handleRemoveComment} />
      </li>
    ))

  const commentCurrPageCount = Math.ceil(comments.filter((data) => data.page == currentPage).length / commentCurrPerPage);

  const handleCommentCurrChangePage = ({ selected }) => {
    setCommentCurrPageNum(selected);
  };

  const handleAnnotations = (allComments, currComments, allHighlights, currHighlights) => {
    setShowAllComment(allComments);
    setShowAllHighlight(allHighlights);
    setShowCurrHighlight(currHighlights);
    setShowCurrComment(currComments);
  }

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="background">
      <div className='right-column'>
        <select className='toc' value={selectedSection} onChange={handleSectionChange}>
          {displayTOC}
        </select>
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
            {displayAllHighlight}
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={highlightAllPageCount}
              onPageChange={handleHighlightAllChangePage}
              containerClassName={"paginationBttns"}
              previousLinkClassName={"previousBttn"}
              nextLinkClassName={"nextBttn"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
            />
          </div>
        )}
        {showCurrHighlight && (
          <div>
            {displayCurrPgHighlight}
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={highlightCurrPageCount}
              onPageChange={handleHighlightCurrChangePage}
              containerClassName={"paginationBttns"}
              previousLinkClassName={"previousBttn"}
              nextLinkClassName={"nextBttn"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
            />
          </div>
        )}
        {showAllComment && (
          <div>
            {displayAllComment}
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={commentAllPageCount}
              onPageChange={handleCommentAllChangePage}
              containerClassName={"paginationBttns"}
              previousLinkClassName={"previousBttn"}
              nextLinkClassName={"nextBttn"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
            />
          </div>
        )}
        {showCurrComment && (
          <div>
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
          </div>
        )}
      </div>
      <div className='left-column'>
        <div className='top-menu'>
          <div>
          <button className='btn' onClick={handleComment}>
            Comment
          </button>
            {showCommentPrompt && (
              <div>
                <form onSubmit={handleCommentPromptSubmit}>
                  <div>
                    <input
                      type="text"
                      id="commentInput"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit">Submit</button>
                  <button onClick={handleCommentPromptCancel}>Cancel</button>
                </form>
              </div>
            )}
          </div>
          <div>
            <button className="btn" onClick={handleShowColorPicker}>
              Highlight
            </button>
            <div className={showColorPicker ? 'open' : ''}>
              {showColorPicker && (
                <TwitterPicker
                  color={highlightColor.current}
                  onChangeComplete={handleHighlightColorChange}
                />
              )}
            </div>
          </div>
        </div>
        <div className='content'>
          {showPrev && (<a className="arrow" onClick={handlePrev}>‹</a>)}
          <div id='viewer'></div>
          {showNext && (<a className="arrow" onClick={handleNext}>›</a>)}
        </div>
      </div>
    </div>
  )
}

export default App;
