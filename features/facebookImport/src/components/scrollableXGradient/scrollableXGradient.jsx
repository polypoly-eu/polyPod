import React, { useRef, useEffect } from "react";
import "./scrollableXGradient.css";

const ScrollableXGradient = ({ scrollableItem }) => {
    const xGradient = useRef();
    const scrollableItemRef = useRef();
    const widthRef = useRef();

    useEffect(() => {
        if (!widthRef.current || !xGradient.current) return;
        if (
            scrollableItemRef.current?.scrollWidth >
            widthRef.current.clientWidth
        ) {
            xGradient.current.classList.add("gradient");
        } else {
            xGradient.current.classList.remove("gradient");
        }
    });

    const handleScroll = () => {
        if (
            (scrollableItemRef.current.scrollLeft +
                widthRef.current.clientWidth) /
                scrollableItemRef.current.scrollWidth ===
            1
        ) {
            xGradient.current.classList.remove("gradient");
        } else {
            xGradient.current.classList.add("gradient");
        }
        return;
    };

    return (
        <div className="startScroll">
            <div ref={widthRef} className="scrollable">
                <h1 ref={scrollableItemRef} onScroll={handleScroll}>
                    {scrollableItem}
                </h1>
                <div className="x-gradient" ref={xGradient}></div>
            </div>
        </div>
    );
};
export default ScrollableXGradient;
