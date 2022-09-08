import React from "react";

import "./fixedFooter.css";

const FixedFooter = ({ children }) => {
  return <div className="fixed-footer">{children}</div>;
};

export default FixedFooter;
