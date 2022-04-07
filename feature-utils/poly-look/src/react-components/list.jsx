import React from "react";

import "./list.css";

/**
 * A list of any jsx (HTML) elements that has padding and is scrollable
 *
 * @param {jsx} children Jsx children
 * @param {String} className CSS classes added to the main div
 * @returns jsx
 */
const List = ({ children, className }) => {
  return <div className={`list ${className}`}>{children}</div>;
};

export default List;
