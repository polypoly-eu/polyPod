import React from "react";

import "./storyCardList.css";

export const StoryCardList = ({ children }) => {
  return <div className="story-card-list">{children}</div>;
};

const renderDetailsButton = (navigation) => {
  if (!navigation) return;
  const { history, route, stateChange, onClick, buttonText } = navigation;
  if (!buttonText) {
    console.error("StoryCard: DetailsButton must have text");
    return;
  }
  if (!history) {
    console.error("StoryCard: Missing history in navigation props");
    return;
  }
  if (!route && !onClick) {
    console.error("StoryCard: DetailsButton must either have route or onClick");
    return;
  }
  const handleClick = () => {
    onClick && onClick();
    route && history.push(route, stateChange);
  };
  return (
    <button className="poly-button centered" onClick={handleClick}>
      {buttonText}
    </button>
  );
};

export const StoryCard = ({ children, navigation }) => {
  return (
    <div className="story-card">
      {children}
      {renderDetailsButton(navigation)}
    </div>
  );
};
