import React from "react";

import "./screen.css";

/**
 * Screen is a function that returns a div with a poly-screen.
 * @param {Object} props - The props for the selected screen
 * @param {Object} props.children - The children for the selected screen
 * @param {string} props.className - The className for the selected screen
 * @param {Object} props.layout - The layout for the selected screen
 * @param {Object} props.onScroll - The onScroll callback for the selected screen
 * @param {Object} props.scrollingRef - The react element for scrollingRef of the screen
 * @returns A div with the className of poly-screen, the className prop, and the layout prop.
 */
const Screen = ({ children, className, layout, onScroll, scrollingRef }) => {
  return (
    <div
      onScroll={onScroll}
      ref={scrollingRef}
      className={`poly-screen ${className || ""} ${layout || ""}`}
    >
      {children}
    </div>
  );
};

export default Screen;
