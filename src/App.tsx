import React, { useEffect, useState } from "react";
import ePub from "epubjs";
import "./App.css";
import "./examples.css";

const bookUrl = "./src/Data/Sample.epub";

function App() {
  const [book, setBook] = useState<any>(null);

  // Load the book only once
  useEffect(() => {
    console.log(`loading book`);
    const _book = ePub(bookUrl);
    setBook(_book);
  }, []);

  useEffect(() => {
    if (!book) return;

    const rendition = book.renderTo("viewer", {
      width: "100%",
      height: 600,
      allowScriptedContent: true,
      spread: "always"
    });

    rendition.display();

    book.ready.then(() => {
      console.log("book ready");
      const next = document.getElementById("next");
      const prev = document.getElementById("prev");

      next.addEventListener(
        "click",
        (e) => {
          book.package.metadata.direction === "rtl"
            ? rendition.prev()
            : rendition.next();
          e.preventDefault();
        },
        false
      );

      prev.addEventListener(
        "click",
        (e) => {
          book.package.metadata.direction === "rtl"
            ? rendition.next()
            : rendition.prev();
          e.preventDefault();
        },
        false
      );

      const keyListener = (e) => {
        if ((e.keyCode || e.which) === 37) {
          book.package.metadata.direction === "rtl"
            ? rendition.next()
            : rendition.prev();
        }
        if ((e.keyCode || e.which) === 39) {
          book.package.metadata.direction === "rtl"
            ? rendition.prev()
            : rendition.next();
        }
      };

      rendition.on("keyup", keyListener);
      document.addEventListener("keyup", keyListener, false);

      // Cleanup event listeners
      return () => {
        document.removeEventListener("keyup", keyListener);
      };
    });

    rendition.on("rendered", (section) => {
      console.log(`Section rendered: ${section}`);
    });

    rendition.on("relocated", (location) => {
      console.log(location);

      const next =
        book.package.metadata.direction === "rtl"
          ? document.getElementById("prev")
          : document.getElementById("next");
      const prev =
        book.package.metadata.direction === "rtl"
          ? document.getElementById("next")
          : document.getElementById("prev");

      if (location.atEnd) {
        next.style.visibility = "hidden";
      } else {
        next.style.visibility = "visible";
      }

      if (location.atStart) {
        prev.style.visibility = "hidden";
      } else {
        prev.style.visibility = "visible";
      }
    });

    book.loaded.navigation.then(function (toc) {
      console.log(`reading toc`)
      const $select = document.getElementById("toc"),
        docfrag = document.createDocumentFragment();

      toc.forEach(function (chapter) {
        console.log(`element: ${chapter}`);
        const option = document.createElement("option");
        option.textContent = chapter.label;
        option.setAttribute("ref", chapter.href);

        docfrag.appendChild(option);
      });

      $select.appendChild(docfrag);

      $select.onchange = function () {
        const index = $select.selectedIndex,
          url = $select.options[index].getAttribute("ref");
        rendition.display(url);
        return false;
      };

    });

   rendition.on("selected", function (cfiRange, contents) {
      rendition.annotations.highlight(cfiRange);
      contents.window.getSelection().removeAllRanges();
    });

    var highlights = document.getElementById('highlights');

    rendition.on("selected", function (cfiRange) {

      book.getRange(cfiRange).then(function (range) {
        var text;
        var li = document.createElement('li');
        var a = document.createElement('a');
        var remove = document.createElement('a');
        var textNode;

        if (range) {
          text = range.toString();
          textNode = document.createTextNode(text);

          a.textContent = cfiRange;
          a.href = "#" + cfiRange;
          a.onclick = function () {
            rendition.display(cfiRange);
          };

          remove.textContent = "remove";
          remove.href = "#" + cfiRange;
          remove.onclick = function () {
            rendition.annotations.remove(cfiRange, "highlight");
            highlights?.removeChild(li)
            return false;
          };

          li.appendChild(textNode);
          li.appendChild(remove);
          highlights.appendChild(li);
        }
      })
    });

    return () => {
      rendition.destroy();
    };
  }, [book]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <select id="toc"></select>
      <div id="viewer" className="spreads"></div>
      <a id="prev" href="#prev" className="arrow">
        ‹
      </a>
      <a id="next" href="#next" className="arrow">
        ›
      </a>
      <div id="extras">
        <ul id="highlights"></ul>
      </div>
    </>
  );
}

export default App;
