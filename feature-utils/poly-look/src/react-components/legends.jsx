import React from "react";
import { Legend } from "./legend";

import "./legends.css";

const legendComponent = (type, legends) => {
  const canonicalLegend = new Legend(legends);
  return (
    <div className={`poly-legend ${type}-legend`}>
      {canonicalLegend.legends.map((content, index) => (
        <div key={index} className="legend-entry">
          <span className="symbol-container">
            <span style={{ backgroundColor: content.color }}></span>
          </span>

          <span className="text">{content.description}</span>
        </div>
      ))}
    </div>
  );
};

const BlockLegend = ({ legend }) => legendComponent("block", legend);
const LineLegend = ({ legend }) => legendComponent("line", legend);
const CircleLegend = ({ legend }) => legendComponent("circle", legend);
export { BlockLegend, LineLegend, CircleLegend };
