import React from "react";

import "./list.css";

/**
 * A list of any jsx (HTML) elements that is scrollable
 * @component
 * @param {Object} props
 * @param {JSX.Element} props.children Jsx children
 * @param {string} props.className CSS classes added to the main div
 * @returns {JSX.Element}
 */
const List = ({ children, className }) => {
  return <div className={`list ${className}`}>{children}</div>;
};

export default List;
