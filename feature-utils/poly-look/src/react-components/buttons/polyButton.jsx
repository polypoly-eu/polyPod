import React from "react";
import "./polyButton.css";

/**
 * Basic button.
 * In addition to `label` and `centered` any valid button HTML attributes
 * are allowed.
 * @param {Object} props
 * @param {string} [props.label] - Button text
 * @param {boolean} [props.centered] - If the button should center itself.
 */

const PolyButton = ({ label, centered, ...otherProps }) => {
  return (
    <button
      {...otherProps}
      className={`poly-button ${centered ? "centered" : ""} ${
        otherProps.className || ""
      }`.trim()}
    >
      {label}
    </button>
  );
};

export default PolyButton;
