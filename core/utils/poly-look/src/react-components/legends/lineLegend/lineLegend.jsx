import React from "react";

import "./lineLegend.css";

const LineLegend = ({ legend }) => {
  return (
    <div className="line-legend">
      {legend.map((content, index) => (
        <div key={index} className="legend-entry">
          <div style={{ backgroundColor: content.color }}></div>
          {content.description}
        </div>
      ))}
    </div>
  );
};

export default LineLegend;
