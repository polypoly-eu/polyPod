import React from "react";

import "./screen.css";

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
