import React, { useState, useRef } from "react";
import { CircleXMark, TriangleExclamation } from "../icons";

import "./common.css";

function getBodyClass(disabled, error, focused) {
  if (disabled) return "body-disabled";
  if ((error && focused) || focused) return "body-focused";
  else if (error) return "body-error";
}

const labelPosition = {
  up: "label-up",
  inside: "",
};

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
  const [isFocused, setFocus] = useState(false);
  const [errorIcon, setErrorIcon] = useState(error);
  const [labelClass, setLabelClass] = useState(
    value ? labelPosition.up : labelPosition.inside
  );
  const inputRef = useRef();
  let bodyClass = getBodyClass(disabled, error, isFocused);
  return (
    <div className="poly-input-field">
      <div
        className={`body ${bodyClass}`}
        onFocus={() => {
          setFocus(true);
          setLabelClass(labelPosition.up);
          if (value) setIconVisibility(true);
          else setIconVisibility(false);
          setErrorIcon(false);
          inputRef.current.focus();
        }}
        onBlur={() => {
          if (!value) setLabelClass(labelPosition.inside);
          setIconVisibility(false);
          if (error) setErrorIcon(true);
          setFocus(false);
        }}
        tabIndex={tabIndex}
        data-testid="input-focusable"
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
            if (e.target.value) setIconVisibility(true);
            onChange({ value: e.target.value, name });
          }}
          name={name}
          id={name}
        />

        <TriangleExclamation
          style={{ display: errorIcon ? "block" : "none" }}
          fill="var(--pl-field-trailing-icon-color-error)"
          className="icon"
        />
        <CircleXMark
          fill="var(--pl-field-trailing-icon-color)"
          style={{ display: isIconVisible ? "block" : "none" }}
          className="icon"
          onClick={() => {
            setIconVisibility(false);
            onChange({ value: "", name });
            inputRef.current.focus();
          }}
        />
      </div>
      <span className="helper-text">{helperText}</span>
    </div>
  );
}
