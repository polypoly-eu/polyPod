import React from "react";
import "./button.css";

/**
 * Basic button.
 * In addition to `label` any valid button HTML attributes are allowed.
 * @param {Object} props
 * @param {string} [props.label] - Button text
 */

const Button = ({ label, ...otherProps }) => {
  return (
    <button
      {...otherProps}
      className={`poly-button ${otherProps.className || ""}`}
    >
      {label}
    </button>
  );
};

export default Button;
