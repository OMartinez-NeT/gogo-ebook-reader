import { useEffect, useState } from "react";
import Highlight from "./components/Highlight";
import Comment from "./components/Comment";
import AnnotationMenu from "./components/AnnotationMenu";
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

  const [highlightAllPageNum, setHighlightAllPageNum] = useState(0);
  const [commentAllPageNum, setCommentAllPageNum] = useState(0);
  const [highlightCurrPageNum, setHighlightCurrPageNum] = useState(0);
  const [commentCurrPageNum, setCommentCurrPageNum] = useState(0);

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

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="background">
      <div className='right-column'>
        <select className='toc' value={selectedSection} onChange={handleSectionChange}>
          {displayTOC}
        </select>
        <AnnotationMenu
          rendition={rendition}
          highlights={highlights}
          comments={comments}
          currentPage={currentPage}
          highlightAllPageNum={highlightAllPageNum}
          highlightCurrPageNum={highlightCurrPageNum}
          commentAllPageNum={commentAllPageNum}
          commentCurrPageNum={commentCurrPageNum}
          setHighlightAllPageNum={setHighlightAllPageNum}
          setHighlightCurrPageNum={setHighlightCurrPageNum}
          setHighlights={setHighlights}
          setCommentAllPageNum={setCommentAllPageNum}
          setCommentCurrPageNum={setCommentCurrPageNum}
          setComments={setComments}
        />
      </div>
      <div className='left-column'>
        <div className='top-menu'>
          <Comment
            rendition={rendition}
            book={book}
            setComments={setComments}
          />
          <Highlight
            rendition={rendition}
            book={book}
            setHighlights={setHighlights}
          />
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