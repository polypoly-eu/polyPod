import React from "react";
import { PolyButton } from "../buttons";
import { RoutingWrapper } from "../routing";
import "./banner.css";

/**
 * Banner component
 *
 * @param {String} [icon] Displays an icon next to the title if passed
 * @param {String} [title] Title of the banner
 * @param {String} [description] Text for the banner's description
 * @param {Object} [button] Content of the button. Also, displays the PolyButton at the bottom if passed.
 * @param {String} [button.route] String to route to ("back" leads back)
 * @param {History} [button.history] React router dom history for the RoutingWrapper component
 * @param {String} [button.label] Text for the button's label
 * @returns jsx
 */
const Banner = ({ icon, title, description, button }) => {
  return (
    <div className="banner poly-theme-light">
      {icon && <img src={icon} alt="icon" className="banner-icon" />}
      <h1 className="banner-title">{title}</h1>
      <p className="banner-description">{description}</p>
      {button && (
        <RoutingWrapper route={button.route} history={button.history}>
          <PolyButton label={button.label} className="banner-button" />
        </RoutingWrapper>
      )}
    </div>
  );
};

export default Banner;
