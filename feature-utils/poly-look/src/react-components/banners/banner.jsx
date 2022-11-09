import React from "react";
import { PolyButton } from "../buttons";
import { RoutingWrapper } from "../routing";
import "./banner.css";

/**
 * Banner component.
 * @callback Banner
 * @param {Object} props
 * @param {string} props.icon Displays an icon next to the title if passed
 * @param {string} props.title Title of the banner
 * @param {string} props.description Text for the banner's description
 * @param {Object} props.button Content of the button. Also, displays the PolyButton at the bottom if passed.
 * @param {string} props.button.route String to route to ("back" leads back)
 * @param {History} props.button.history React router dom history for the RoutingWrapper component
 * @param {String} props.button.label Text for the button's label
 * @returns {JSX.Element}
 */
export const Banner = ({ icon, title, description, button }) => {
  return (
    <div className="banner poly-theme-light">
      <div className="banner-header">
        {icon && <img src={icon} alt="icon" className="banner-icon" />}
        <h1 className="banner-title">{title}</h1>
      </div>
      <p className="banner-description">{description}</p>
      {button && (
        <RoutingWrapper route={button.route} history={button.history}>
          <PolyButton label={button.label} className="banner-button" />
        </RoutingWrapper>
      )}
    </div>
  );
};
