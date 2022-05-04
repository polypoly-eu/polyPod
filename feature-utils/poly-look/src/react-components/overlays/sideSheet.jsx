import React from "react";
import { PolyButton, IconButton } from "../buttons";

import "./sideSheet.css";

/**
 *
 * Generic container for HTRT content with close button(s).
 * Meant to be used in combination with SideSwiper.
 * @param {Object} props
 * @param {node} [props.children] - HTRT content.
 * @param {string} [props.okLabel] - Label used for the close button.
 * @param {callback} [props.onClose] - onClick event handler for the
 * close buttons.
 * @param {string} [props.title = ""] - Optional title.
 * Defaults to empty string;
 * @param {React.CSSProperties} [props.style] - Additional styles for
 * the component.
 * Defaults to empty object;
 * @returns {JSX.Element}
 */
const SideSheet = ({ children, okLabel, onClose, title = "", style = {} }) => {
  return (
    <div className="poly-side-sheet" style={style}>
      <div className="header">
        <IconButton
          icon="angleRight"
          fillDirection="right"
          onClick={onClose}
          className="close-button-left"
        />
        {title && <h1 className="title title-center">{title}</h1>}
      </div>

      {children}

      <div className="button-holder poly-theme-light">
        <PolyButton label={okLabel} onClick={onClose} />
      </div>
    </div>
  );
};

export default SideSheet;
