import React from "react";
import { INITIAL_HISTORY_STATE } from "../../constants";

import "./cardList.css";

/**
 * A list of Cards
 *
 * @param {jsx} children Jsx children (Cards)
 * @param {String} className CSS classes added to the main div
 * @returns jsx
 */
export const CardList = ({ children, className }) => {
  return <div className={`card-list ${className}`}>{children}</div>;
};

/**
 * Card component that makes up a CardList
 *
 * @param {jsx} children HTML elements displayed inside the card
 * @param {Object} navigation if passed will show a button and will trigger actions
 * @param {History} navigation.history a useHistory generated history (also requires route)
 * @param {String} navigation.route a router route (also requires history)
 * @param {Object} navigation.stateChange a router history stateChange (also requires history)
 * @param {Callback} navigation.onClick onClick function
 * @param {String} navigation.buttonText the buttons displayed text
 * @returns jsx
 */
export const Card = ({ children, navigation }) => {
  if (!navigation) return <div className="card">{children}</div>;
  const { history, route, stateChange, onClick, buttonText } = navigation;
  if (!buttonText) {
    console.error("Card: DetailsButton must have text");
    return null;
  }
  if (!(history && route) && !onClick) {
    console.error("Card: Navigation either needs history and route or onClick");
    return null;
  }

  const handleDivClick = () => {
    onClick && onClick();
    route && history.push(route, { ...INITIAL_HISTORY_STATE, ...stateChange });
  };

  return (
    <div className="card" onClick={handleDivClick}>
      {children}
      <button className="poly-button centered">{buttonText}</button>
    </div>
  );
};
