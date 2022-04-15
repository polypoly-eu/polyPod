import React from "react";
import "./button.css";

/**
 * Basic button.
 * In addition to `label` any valid button HTML attributes are allowed.
 * The only exception are classes.
 * @param {Object} props
 * @param {string} [props.label] - Button text
 */

const Button = ({ label, ...otherProps }) => {
  return (
    <button {...otherProps} className="poly-button">
      {label}
    </button>
  );
};

export default Button;
