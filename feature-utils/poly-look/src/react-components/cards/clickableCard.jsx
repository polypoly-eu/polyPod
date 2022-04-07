import React from "react";

import "./card.css";

/**
 * Clickable Card component
 *
 * @param {jsx} children JSX elements displayed inside the card
 * @param {Callback} onClick onClick function
 * @param {String} [buttonText] displays a button with the string at the bottom if passed
 * @param {String} [onlyButtonClickEvent] if a button is active, makes the button the only clickable part
 * @returns jsx
 */
const ClickableCard = ({
  children,
  onClick,
  buttonText,
  onlyButtonClickEvent = false,
}) => {
  return (
    <div
      className="card"
      onClick={buttonText && onlyButtonClickEvent ? onClick : () => {}}
    >
      {children}
      {buttonText && (
        <button className="poly-button centered">{buttonText}</button>
      )}
    </div>
  );
};

//TODO: Add propTypes

export default ClickableCard;
