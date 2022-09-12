import React from "react";
import "./polyButton.css";

/**
 * Basic button.
 * In addition to `label` and `centered` any valid button HTML attributes
 * are allowed.
 * If either `iconLeft` or `iconRight` are specified, the button size will
 * be set to small.
 * @param {Object} props
 * @param {string} [props.label] - Button text
 * @param {boolean} [props.centered] - If the button should center itself.
 * @param {string} [props.type = "filled"] - Type of the button
 * @param {string} [props.size = "large"] - Size of the button
 * @param {JSX} [props.iconLeft] - Optional icon to be displayed on the left side
 * of the label.
 * @param {JSX} [props.iconRight] - Optional icon to be displayed on the right
 * side of the label.
 */

const types = {
  filled: "filled",
  outline: "outline",
};

const sizes = {
  large: "large",
  small: "small",
};

const PolyButton = ({
  label,
  type = "filled",
  size = "large",
  iconLeft,
  iconRight,
  ...otherProps
}) => {
  return (
    <button
      {...otherProps}
      className={`poly-button ${types[type]} ${
        iconLeft || iconRight ? sizes.small : sizes[size]
      } ${otherProps.className || ""}`.trim()}
    >
      {iconLeft && (
        <span
          data-testid="test-icon"
          className="poly-icon-small icon icon-left"
        >
          {iconLeft}
        </span>
      )}
      {label}
      {iconRight && (
        <span
          data-testid="test-icon"
          className="poly-icon-small icon icon-right"
        >
          {iconRight}
        </span>
      )}
    </button>
  );
};

export default PolyButton;
