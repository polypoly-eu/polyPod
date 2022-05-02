import React from "react";
import { INITIAL_HISTORY_STATE } from "../../constants";
import ClickableCard from "./clickableCard.jsx";

/**
 * Clickable Card component that will route to somewhere by using react-router-dom history
 *
 * @param {jsx} children JSX elements displayed inside the card
 * @param {History} history react-router-dom history
 * @param {String}  route navigating to through history
 * @param {String} [stateChange] sets the history state to non-default
 * @param {String} [buttonText] makes button appear with this text
 * @returns jsx
 */
const RoutingCard = ({
  children,
  history,
  route,
  stateChange,
  buttonText,
  onlyButtonClickEvent,
}) => {
  const handleClick = () => {
    history.push(route, { ...INITIAL_HISTORY_STATE, ...stateChange });
  };
  return (
    <ClickableCard
      onClick={handleClick}
      buttonText={buttonText}
      onlyButtonClickEvent={onlyButtonClickEvent}
    >
      {children}
    </ClickableCard>
  );
};

export default RoutingCard;
