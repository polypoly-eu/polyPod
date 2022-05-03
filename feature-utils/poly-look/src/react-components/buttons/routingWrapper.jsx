import React from "react";
import { INITIAL_HISTORY_STATE } from "../../constants";

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
