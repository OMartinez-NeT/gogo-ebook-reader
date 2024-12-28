import React, { useEffect, useState } from "react";
import ePub from "epubjs";
import "./App.css";
import "./examples.css";

const bookUrl = "https://s3.amazonaws.com/moby-dick/moby-dick.epub";

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


    book.loaded.navigation.then(function(toc){


      console.log(`reading toc`)
			const $select = document.getElementById("toc"),
					docfrag = document.createDocumentFragment();

			toc.forEach(function(chapter) {
        console.log(`element: ${chapter}`);
				const option = document.createElement("option");
				option.textContent = chapter.label;
				option.setAttribute("ref", chapter.href);

				docfrag.appendChild(option);
			});

			$select.appendChild(docfrag);

			$select.onchange = function(){
					const index = $select.selectedIndex,
							url = $select.options[index].getAttribute("ref");
					rendition.display(url);
					return false;
			};

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
    </>
  );
}

export default App;
