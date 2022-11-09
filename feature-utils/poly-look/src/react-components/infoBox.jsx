import React from "react";

import "./infoBox.css";

/**
 * Returns a div with an image and a div with the textContent passed.
 * @component
 * @param {Object} props
 * @param {Object} props.textContent - textContent div.
 */
const InfoBox = ({ textContent }) => {
  return (
    <div className="infobox">
      <img src="./images/info-circle.svg" alt="" className="icon" />
      <div className="text-content">{textContent}</div>
    </div>
  );
};

export default InfoBox;
