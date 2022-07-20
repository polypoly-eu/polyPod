import React from "react";

import "./popUpBanner.css";

const types = {
  default: "default",
  successful: "successful",
  error: "error",
  warning: "warning",
};

const PopUpBanner = ({ children, notificationType }) => {
  return (
    <div className="pop-up-container">
      <div className={`pop-up-banner ${types[notificationType]}`}>
        {children}
      </div>
    </div>
  );
};

export default PopUpBanner;
