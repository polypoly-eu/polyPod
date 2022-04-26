import React from "react";
import "./polyButton.css";

/**
 * Basic button.
 * In addition to `label` any valid button HTML attributes are allowed.
 * @param {Object} props
 * @param {string} [props.label] - Button text
 */

const PolyButton = ({ label, ...otherProps }) => {
  return (
    <button
      {...otherProps}
      className={`poly-button ${otherProps.className || ""}`.trim()}
    >
      {label}
    </button>
  );
};

export default PolyButton;
