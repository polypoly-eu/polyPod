import React from "react";
import { Tooltip } from "./";
import { LineLegend, BlockLegend, CircleLegend } from "../legends.jsx";

import "./infographicLegend.css";

/** Augments the different legend components with tooltips.
 * @param {Object} props
 * @param {Array[Object]} [props.legend] - an array of objects that combines the different
 * props for the legend components and the Tooltip component.
 * @returns {JSX.Element}
 */
const InfographicLegend = ({ legend }) => {
  function getLegendComponent(type) {
    const TextLegend = ({ legend }) => {
      return <div className="text-legend">{legend}</div>;
    };

    const types = {
      line: LineLegend,
      block: BlockLegend,
      circle: CircleLegend,
      text: TextLegend,
    };

    return types[type];
  }

  function renderLegend({ type, tooltip, items }) {
    return (
      <>
        {getLegendComponent(type)({ legend: items })}
        {tooltip && (
          <Tooltip
            label={tooltip.label}
            pointerDirection={tooltip.pointerDirection}
          />
        )}
      </>
    );
  }
  return (
    <div className="poly-infographic-legend">
      {legend.map((entry, index) => (
        <div
          key={index}
          data-testid="infographic-legend-entry-test"
          className={`legend-container tooltip-${entry.tooltip?.pointerDirection}`}
        >
          {renderLegend(entry)}
        </div>
      ))}
    </div>
  );
};

export default InfographicLegend;
