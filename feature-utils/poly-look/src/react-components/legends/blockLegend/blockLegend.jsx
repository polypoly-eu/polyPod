import React from "react";

import "./blockLegend.css";

const BlockLegend = ({ legend }) => {
  return (
    <div className="block-legend">
      {legend.map((content, index) => (
        <div key={index} className="legend-entry">
          <div style={{ backgroundColor: content.color }}></div>
          {content.description}
        </div>
      ))}
    </div>
  );
};

export default BlockLegend;
