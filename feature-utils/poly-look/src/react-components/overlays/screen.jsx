import React from "react";

import "./screen.css";

const Screen = ({ children, className, layout }) => {
  return (
    <div className={`poly-screen ${className || ""} ${layout || ""}`}>
      {children}
    </div>
  );
};

export default Screen;
