import { useState, useCallback, useRef } from "react";
import "../examples.css";

const Highlight = ({ rendition, book, setHighlights }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const highlightColor = useRef('yellow');

    const defaultColors = ['#ff6900', '#fcb900', '#7bdcb5', '#00d084', 
        '#8ed1fc', '#0693e3', '#abb8c3', '#eb144c', '#f78da7', '#9900ef'];


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
        highlightColor.current = color;
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
                    <div className="color-picker-container">
                        {defaultColors.map((defaultColors, index) => (
                            <button
                                key={index}
                                style={{ backgroundColor: defaultColors}}
                                className="color-picker-card"
                                onClick={() => handleHighlightColorChange(defaultColors)}
                            >
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
};

export default Highlight;