import React from "react";

import "./storyCardList.css";

/**
 * A list of StoryCards
 *
 * @param {jsx} children Jsx children (Storycards)
 * @param {String} className CSS classes added to the main div
 * @returns jsx
 */
export const StoryCardList = ({ children, className }) => {
  return <div className={`story-card-list ${className}`}>{children}</div>;
};

/**
 * Card component that makes up a StoryList
 *
 * @param {jsx} children HTML elements displayed inside the card
 * @param {Object} navigation Navigation object, if passed will show a button and will trigger actions
 * @param {History} navigation.history a useHistory generated history (also requires route)
 * @param {String} navigation.route a router route (also requires history)
 * @param {Callback} navigation.onClick onClick function
 * @param {String} buttonText the buttons displayed text
 * @returns jsx
 */
export const StoryCard = ({ children, navigation }) => {
  if (!navigation) return <div className="story-card">{children}</div>;
  const { history, route, stateChange, onClick, buttonText } = navigation;
  if (!buttonText) {
    console.error("StoryCard: DetailsButton must have text");
    return null;
  }
  if (!(history && route) && !onClick) {
    console.error(
      "StoryCard: Navigation either needs history and route or onClick"
    );
    return null;
  }

  const handleDivClick = () => {
    onClick && onClick();
    route && history.push(route, stateChange);
  };

  return (
    <div className="story-card" onClick={handleDivClick}>
      {children}
      <button className="poly-button centered">{buttonText}</button>
    </div>
  );
};
