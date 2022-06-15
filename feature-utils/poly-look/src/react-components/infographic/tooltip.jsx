import React from "react";
import "./tooltip.css";

/** Small tooltip with pointer.
 * @param {Object} props
 * @param {string} [props.label] - tooltip label; preferably single letter/digit
 * as the tooltip is not designed for large texts.
 * @param {string} [props.pointerDirection] - where to position the pointer;
 * Currently only `down` and `left` options are implemented.
 * @returns {JSX.Element}
 */
const Tooltip = ({ label, pointerDirection = "down" }) => {
  return (
    <div className="poly-tooltip">
      <div className={pointerDirection}>
        <div className="square">{label}</div>
        <div className={`triangle-${pointerDirection}`}></div>
      </div>
    </div>
  );
};

export default Tooltip;
