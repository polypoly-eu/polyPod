import React from "react";

import "./blockLegend.css";

const BlockLegend = ({ legend }) => {
  return (
    <div className="block-legend">
      {legend.map((e, i) => (
        <div key={i} className="legend-entry">
          <div style={{ backgroundColor: e.color }}></div>
          {e.description}
        </div>
      ))}
    </div>
  );
};

export default BlockLegend;
