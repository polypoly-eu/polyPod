import React from "react";
import { PolyButton } from "../buttons";
import "./card.css";

/**
 * Callback for handling the click event to close notification.
 *
 * @callback onClickCallback
 * @param {React.MouseEventHandler<HTMLDivElement>} clickEvent - mouse event action.
 */

/**
 * Clickable Card with a button component
 * @component
 * @param {Object} props
 * @param {JSX.Element} [props.children] JSX elements displayed inside the card
 * @param {onClickCallback} [props.onClick] onClick function
 * @param {string} [props.buttonText] displays a button with the string at the bottom if passed
 * @param {string} [props.onlyButtonClickEvent] if a button is active, makes the button the only clickable part
 * @returns {JSX.Element}  A function that returns a div
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
      onClick={buttonText && onlyButtonClickEvent ? () => {} : onClick}
    >
      {children}
      {buttonText && (
        <PolyButton
          className="poly-self-centered"
          label={buttonText}
          onClick={onlyButtonClickEvent ? onClick : () => {}}
        />
      )}
    </div>
  );
};

//TODO: Add propTypes

export default ClickableCard;
