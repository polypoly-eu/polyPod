import React from "react";

import "./card.css";

/**
 * Card component
 * It takes in children and returns a div with the class of card and the children
 * inside of it.
 * @component
 * @param {JSX.Element} children JSX elements displayed inside the card
 * @returns  {JSX.Element} A card component
 */
const Card = ({ children }) => {
  return <div className="card">{children}</div>;
};

//TODO: Add propTypes

export default Card;
