import React, { useEffect, useState, useCallback } from "react";
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
  const [isCommentEnabled, setCommentEnabled] = useState(false);

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

  const handleHighlightingText = useCallback((cfiRange, contents) => {
    rendition.annotations.highlight(cfiRange);
    contents.window.getSelection().removeAllRanges();
  }, [rendition]);

  const handleHighlight = () => {
    if (isHighlightEnabled) {
      rendition.off('selected', handleHighlightingText);
      setHighlightEnabled(false);
    } else {
      rendition.on('selected', handleHighlightingText);
      setHighlightEnabled(true);
    }
  };

  const handleCommentingText = useCallback((cfiRange, contents) => {
    const selectedText = contents.window.getSelection().toString();
    console.log(cfiRange, selectedText);
  }, [rendition]);

  const handleComment = () => {
    if (isCommentEnabled) {
      rendition.off('selected', handleCommentingText);
      setCommentEnabled(false);
    } else {
      rendition.on('selected', handleCommentingText);
      setCommentEnabled(true);
    }
  }

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='right-column'>
        <select className='toc' value={selectedSection} onChange={handleSectionChange}>
          {toc.map((section, index) => (
            <option key={index} value={section.href}>
              {section.label}
            </option>
          ))}
        </select>
      </div>
      <div className='left-column'>
        <div className='top-menu'>
          <button
            className={isHighlightEnabled ? 'btn on' : 'btn off'}
            onClick={handleHighlight}
          >
            {isHighlightEnabled ? 'Highlights: On' : 'Highlights: Off'}
          </button>
          <button
            className={isCommentEnabled ? 'btn on' : 'btn off'}
            onClick={handleComment}
          >
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
