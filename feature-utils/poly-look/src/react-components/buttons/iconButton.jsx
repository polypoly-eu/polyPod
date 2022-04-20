import React from "react";

import angleRight from "../../static/images/icons/angle-right.svg";
import question from "../../static/images/icons/question.svg";
import filter from "../../static/images/icons/filter.svg";

import "./iconButton.css";

/**
 * Icon button. Has a filled variant.
 * Any valid button HTML attributes are allowed.
 * The only exception are classes.
 * @param {Object} props
 * @param {string} [props.icon] - Button icon
 * Currently implemented options are: angleRight, question, filter.
 * @param {string} [props.fillDirection] - This option adds a background color
 * and a border radius to the direction specified.
 * Available options are left and right.
 */
const IconButton = ({ icon, fillDirection = "", ...otherProps }) => {
  const icons = {
    angleRight,
    question,
    filter,
  };
  if (!icons[icon])
    console.warn(
      `IconButton: Invalid icon option. Available options: ${Object.keys(
        icons
      )}`
    );
  return (
    <button
      {...otherProps}
      className={
        fillDirection ? `filled filled-${fillDirection}` : "icon-button"
      }
    >
      <img src={icons[icon]} />
    </button>
  );
};
export default IconButton;
