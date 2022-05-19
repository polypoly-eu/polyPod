import React from "react";
import "./polyButton.css";

/**
 * Basic button.
 * In addition to `label` and `centered` any valid button HTML attributes
 * are allowed.
 * @param {Object} props
 * @param {string} [props.label] - Button text
 * @param {boolean} [props.centered] - If the button should center itself.
 * @param {string} [props.type = "filled"] - Type of the button
 */

const types = {
  filled: "filled",
  outline: "outline",
};

const PolyButton = ({ label, centered, type = "filled", ...otherProps }) => {
  return (
    <button
      {...otherProps}
      className={`poly-button ${centered ? "centered" : ""} ${types[type]} ${
        otherProps.className || ""
      }`.trim()}
    >
      {label}
    </button>
  );
};

export default PolyButton;
