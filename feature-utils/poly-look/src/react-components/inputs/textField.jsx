import React, { useState, useRef } from "react";
import { CircleXMark, TriangleExclamation } from "../icons";

import "./common.css";

function getBodyClass(disabled, error, focused) {
  if (disabled) return "body-disabled";
  if ((error && focused) || focused) return "body-focused";
  else if (error) return "body-error";
}

/** Text field input with clear icon.
 * @param {Object} props
 * @param {string} [props.value] - input value
 * @param {callback} [props.onChange] - onChange event handler
 * @param {string} [props.name] - input name, also acts as id
 * @param {string} [props.helperText] - input helper text
 * @param {string} [props.label] - input label
 * @param {number} [props.tabIndex] - input tabIndex, needed to make sure the
 * focus/blur internal logic works
 * @param {boolean} [props.error] - indicates if the input is in an error
 * state or not
 * @param {boolean} [props.disabled] - indicates if the input is disabled
 * @returns {JSX.Element}
 */
export function TextField({
  value,
  onChange,
  name,
  helperText,
  label,
  tabIndex,
  error,
  disabled,
}) {
  const [isIconVisible, setIconVisibility] = useState(false);
  const [errorIcon, setErrorIcon] = useState(error);
  const inputRef = useRef();
  let labelClass = value || isIconVisible ? "label-up" : "";
  let bodyClass = getBodyClass(disabled, error, isIconVisible);

  return (
    <div className="poly-input-field">
      <div
        className={`body ${bodyClass}`}
        onFocus={() => {
          setIconVisibility(true);
          setErrorIcon(false);
          inputRef.current.focus();
        }}
        onBlur={() => {
          setIconVisibility(false);
          if (error) setErrorIcon(true);
        }}
        tabIndex={tabIndex}
      >
        <label htmlFor={name} className={labelClass}>
          {label}
        </label>
        <input
          disabled={disabled}
          autoComplete="off"
          ref={inputRef}
          value={value}
          onChange={(e) => {
            onChange({ value: e.target.value, name });
          }}
          name={name}
          id={name}
        />

        <TriangleExclamation
          style={{ display: errorIcon ? "block" : "none" }}
          fill="var(--pl-field-trailing-icon-color-error)"
          className="poly-icon-small"
        />
        <CircleXMark
          fill="var(--pl-field-trailing-icon-color)"
          style={{ display: isIconVisible ? "block" : "none" }}
          className="poly-icon-small"
          onClick={() => {
            console.log("clicky");
            onChange({ value: "", name });
            inputRef.current.focus();
          }}
        />
      </div>
      <span className="helper-text">{helperText}</span>
    </div>
  );
}
