import React from "react";

import "./screen.css";
import "../../css/layout.css";

const Screen = ({ children, className, layout }) => {
  return (
    <div className={`screen ${className || ""} ${layout || ""}`}>
      {children}
    </div>
  );
};

export default Screen;
