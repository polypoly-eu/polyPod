import React from "react";
import { INITIAL_HISTORY_STATE } from "../../constants";

/**
 * Component that makes any children that have onClick properties a router onClick
 * This will not override the onClick property of the children but give them a new one combining routing
 * and the previous onClick
 * This does not add any divs or ther HTML elements
 *
 * @param {jsx} children - React children in jsx format
 * @param {History} history - React router dom history
 * @param {String} route - String to route to ("back" leads back)
 * @param {Object} [stateChange] - Initial state overriding INITIAL_HISTORY_STATE property to which it defaults
 * @returns
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
