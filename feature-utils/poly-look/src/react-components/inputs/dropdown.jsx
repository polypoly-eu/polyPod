import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "../icons";

import "./common.css";
import "./dropdown.css";

function getBodyClass(disabled, error, focused) {
  if (disabled) return "body-disabled";
  if (error && focused) return "body-focused";
  else if (error) return "body-error";
}

function filterOptions(options, text) {
  return options.filter((option) => option.value.includes(text));
}

/** Dropdown with options filtering.
 * @param {Object} props
 * @param {Object} [props.initialSelection] - input value, has to contain
 * an id and value, leave empty if the dropdown is not pre-populated
 * @param {callback} [props.onChange] - onChange event handler
 * @param {string} [props.name] - input name, also acts as id
 * @param {string} [props.helperText] - input helper text
 * @param {string} [props.label] - input label
 * @param {number} [props.tabIndex] - input tabIndex, needed to make sure the
 * focus/blur internal logic works
 * @param {boolean} [props.error] - indicates if the input is in an error
 * state or not
 * @param {boolean} [props.disabled] - indicates if the input is disabled
 * @param {Array[Object]} [props.options] - array containing the dropdown options,
 * an option should have an id and a value
 * @param {string} [props.noMatch] - text to be shown when there is no match
 * @returns {JSX.Element}
 */

export function Dropdown({
  initialSelection = {},
  onChange,
  name,
  helperText,
  label,
  tabIndex,
  error,
  disabled,
  options,
  noMatch,
}) {
  const [open, setOpen] = useState(false);
  const [dropdownOptions, setOptions] = useState(options);
  const [query, setQuery] = useState(initialSelection.value || "");
  const [selected, setSelected] = useState(initialSelection);
  const inputRef = useRef();

  let labelClass = query || open ? "label-up" : "";
  let bodyClass = getBodyClass(disabled, error, open);

  useEffect(() => {
    onChange({ ...selected, name });
  }, [selected]);

  return (
    <div className="poly-input-field poly-dropdown">
      <div
        className={`body ${bodyClass}`}
        onFocus={() => {
          setOpen(true);
          inputRef.current.focus();
        }}
        onBlur={() => setOpen(false)}
        tabIndex={tabIndex}
      >
        <label htmlFor={name} className={labelClass}>
          {label}
        </label>
        <input
          disabled={disabled}
          autoComplete="off"
          ref={inputRef}
          onChange={(e) => {
            setOptions(filterOptions(options, e.target.value));
            setQuery(e.target.value);
            setSelected({ id: null, value: null });
          }}
          name={name}
          id={name}
          value={query}
        />
        <ChevronDown
          fill="var(--pl-field-trailing-icon-color)"
          className={`poly-icon-small icon-${open ? "up" : "down"}`}
        />
        <div
          className="list-holder"
          style={{ display: open ? "flex" : "none" }}
        >
          {dropdownOptions.length ? (
            dropdownOptions.map((elem) => (
              <div
                key={elem.id}
                className="option"
                id={elem.id}
                onClick={() => {
                  setQuery(elem.value);
                  setSelected(elem);
                  inputRef.current.blur();
                }}
              >
                {elem.value}
              </div>
            ))
          ) : (
            <div className="option no-value">{noMatch}</div>
          )}
        </div>
      </div>
      <span className="helper-text">{helperText}</span>
    </div>
  );
}
