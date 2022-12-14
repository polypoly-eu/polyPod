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

/**
 * A legend element that shows entries with colored rectangles.
 *
 * @function
 * @param props
 * @param props.legends {LegendEntry[]}
 * @returns {JSX.Element}
 */
export const BlockLegend = ({ legends }) => legendComponent("block", legends);

/**
 * A legend element that shows entries with colored lines.
 *
 * @function
 * @param props
 * @param props.legends {LegendEntry[]}
 * @returns {JSX.Element}
 */
export const LineLegend = ({ legends }) => legendComponent("line", legends);

/**
 * A legend element that shows entries with colored circles.
 *
 * @function
 * @param props
 * @param props.legends {LegendEntry[]}
 * @returns {JSX.Element}
 */
export const CircleLegend = ({ legends }) => legendComponent("circle", legends);
