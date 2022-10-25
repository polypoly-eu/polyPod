import React from "react";
import "./tooltip.css";

/**
 * Small tooltip with pointer.
 * It takes in a label and a pointerDirection prop, and returns a div with a class of poly-tooltip
 * @component
 * @param {Object} props
 * @param {string} [props.label] - tooltip label; preferably single letter/digit
 * as the tooltip is not designed for large texts.
 * @param {string} [props.pointerDirection] - where to position the pointer;
 * Currently only `down` and `left` options are implemented.
 * @returns {JSX.Element} a div with a class of poly-tooltip, which contains a div with a class of either up, down, left, or right, which
 * contains a div with a class of square, and a div with a class of either triangle-up, triangle-down,
 * triangle-left, or triangle-right.
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
