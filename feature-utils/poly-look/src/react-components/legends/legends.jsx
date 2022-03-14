import React from "react";
import { Legend } from "./legend";

import "./legends.css";

const legendComponent = (type, legends) => {
  const canonicalLegend = new Legend(legends);
  return (
    <div className={`${type}-legend`}>
      {canonicalLegend.legends.map((content, index) => (
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
