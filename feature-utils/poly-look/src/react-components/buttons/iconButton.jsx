import React from "react";

import angleRight from "../../static/images/icons/angle-right.svg";
import question from "../../static/images/icons/question.svg";
import filter from "../../static/images/icons/filter.svg";

import "./iconButton.css";

const iconTypes = {
  angleRight,
  question,
  filter,
};

const IconButton = ({ icon, fillDirection = "", ...otherProps }) => {
  return (
    <button
      {...otherProps}
      className={
        fillDirection ? `filled filled-${fillDirection}` : "icon-button"
      }
    >
      {iconTypes[icon] && <img src={iconTypes[icon]} />}
    </button>
  );
};
export default IconButton;
