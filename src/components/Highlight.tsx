import { useState, useCallback, useRef } from "react";
import { TwitterPicker } from 'react-color';
import "../examples.css";

const Highlight = ({ rendition, book, setHighlights }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const highlightColor = useRef('yellow');

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

    const handleHighlightColorChange = (color) => {
        highlightColor.current = color.hex;
        handleHighlight();
        setShowColorPicker(false);
    }

    const handleShowColorPicker = () => {
        setShowColorPicker(!showColorPicker);
    }

    return (
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
    )
};

export default Highlight;