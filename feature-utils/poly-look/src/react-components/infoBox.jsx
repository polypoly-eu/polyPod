import React from "react";

import "./infoBox.css";

const InfoBox = ({ textContent, img }) => {
  return (
    <div className="infobox">
      <img src={img} alt="" className="icon" />
      <div className="text-content">{textContent}</div>
    </div>
  );
};

export default InfoBox;
