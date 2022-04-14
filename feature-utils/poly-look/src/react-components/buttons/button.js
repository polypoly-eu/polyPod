import React from "react";
import "./button.css";

const Button = ({ label, disabled = false, ...rest }) => {
  return (
    <button
      className={`poly-button ${disabled ? "poly-button-disabled" : ""}`}
      {...rest}
    >
      {label}
    </button>
  );
};

export default Button;
