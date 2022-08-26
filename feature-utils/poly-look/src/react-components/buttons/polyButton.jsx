import React from "react";
import "./polyButton.css";

/**
 * Basic button.
 * In addition to `label` and `centered` any valid button HTML attributes
 * are allowed.
 * @param {Object} props
 * @param {string} [props.label] - Button text
 * @param {boolean} [props.centered] - If the button should center itself.
 * @param {string} [props.type = "primary"] - Type of the button
 */

const types = {
  primary: "primary",
  medium: "primary-medium",
  secondary: "secondary",
};

const PolyButton = ({ label, type = "primary", ...otherProps }) => {
  return (
    <button
      {...otherProps}
      className={`poly-button ${types[type]} ${
        otherProps.className || ""
      }`.trim()}
    >
      {label}
    </button>
  );
};

export default PolyButton;
