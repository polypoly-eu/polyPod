import React from "react";

import "./legends.css";

const legendComponent = (type, legend) => {
  return (
    <div className={`${type}-legend`}>
      {legend.map((content, index) => (
        <div key={index} className="legend-entry">
          <div style={{ backgroundColor: content.color }}>
            {content.description}
          </div>
        </div>
      ))}
    </div>
  );
};

const BlockLegend = ({ legend }) => legendComponent("block", legend);
const LineLegend = ({ legend }) => legendComponent("type", legend);
export { BlockLegend, LineLegend };
