import React from "react";

import "./story-card-list.css";

export const StoryCardList = ({ children, history }) => {
  console.log("listx");
  return <div className="story-card-list">{children}</div>;
};

export const StoryCard = ({ children }) => {
  return <div className="story-card">{children}</div>;
};
