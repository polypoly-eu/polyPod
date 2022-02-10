import React, { useEffect, useRef } from "react";

import "./screen.css";

const Screen = ({
    className,
    theme,
    topShadow = true,
    children,
    noScroll = false,
    setScrollingRef,
}) => {
    const scrollingRef = useRef();

    useEffect(() => {
        setScrollingRef && setScrollingRef(scrollingRef.current);
    }, []);

    return (
        <div className={`${theme || ""} explorer-container`}>
            {topShadow && <div className="poly-nav-bar-separator-overlay" />}
            <div
                ref={scrollingRef}
                className={`${
                    noScroll && "noScroll"
                } screen-content ${className}`}
            >
                {children}
            </div>
        </div>
    );
};

export default Screen;
