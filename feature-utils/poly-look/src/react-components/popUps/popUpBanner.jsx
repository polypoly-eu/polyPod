import React from "react";

import "./popUpBanner.css";

const types = {
  successful: "successful",
  unsuccessful: "unsuccessful",
};

const PopUpBanner = ({ children, reportType }) => {
  return (
    <div className="pop-up-container">
      <div className={`pop-up-banner ${types[reportType]}`}>{children}</div>
    </div>
  );
};

export default PopUpBanner;
