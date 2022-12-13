import React from "react";
import { INITIAL_HISTORY_STATE } from "../../constants";

/**
 * It takes a React component and returns a new React component that
 * wraps the original component and adds a new onClick function to it
 * for any children that have already onClick properties.
 * This will not override the onClick property of the children but give them a new one combining routing
 * and the previous onClick.
 * This does not add any divs or ther HTML elements.
 * @component
 * @param {Object} props
 * @param {JSX.Element} props.children - React children in jsx format
 * @param {Object} props.history - React router dom history
 * @param {string} props.route - String to route to ("back" leads back)
 * @param {Object} props.stateChange - Initial state overriding {@link INITIAL_HISTORY_STATE} property to which it defaults
 * @returns A React component that takes in children, history, route, and stateChange as props.
 */
const RoutingWrapper = ({ children, history, route, stateChange }) => {
  const onRoute = () => {
    if (route == "back") history.goBack();
    else history.push(route, { ...INITIAL_HISTORY_STATE, ...stateChange });
  };
  const generateOnClick = (child) => {
    if (!child.props.onClick) return onRoute;
    return () => {
      child.props.onClick();
      onRoute();
    };
  };
  return (
    <React.Fragment>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          onClick: generateOnClick(child),
        })
      )}
    </React.Fragment>
  );
};

export default RoutingWrapper;
