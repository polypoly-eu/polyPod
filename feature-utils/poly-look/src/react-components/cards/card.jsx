import React from "react";

import "./card.css";

/**
 * Card component
 *
 * @param {jsx} children JSX elements displayed inside the card
 * @returns jsx
 */
const Card = ({ children }) => {
  return <div className="card">{children}</div>;
};

//TODO: Add propTypes

export default Card;
