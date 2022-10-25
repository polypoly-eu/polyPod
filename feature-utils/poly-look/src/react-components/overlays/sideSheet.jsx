import React from "react";
import { PolyButton, IconButton } from "../buttons";

import "./sideSheet.css";

/**
 * Callback for handling the click event to close button.
 *
 * @callback onCloseCallback
 * @param {React.MouseEventHandler<HTMLDivElement>} clickEvent - mouse event action.
 */

/**
 * Generic container for HTRT content with close button(s).
 * It renders a side sheet with a title, children, and an ok button.
 * Meant to be used in combination with SideSwiper.
 * @param {Object} props
 * @param {Node} props.children - HTRT content.
 * @param {string} props.okLabel - Label used for the close button.
 * @param {onCloseCallback} props.onClose - onClick event handler for the
 * close buttons.
 * @param {string} [props.title = ""] - Optional title.
 * Defaults to empty string;
 * @param {React.CSSProperties} [props.style] - Additional styles for
 * the component. Defaults to empty object;
 * @param {string} props.className - classname given
 * @returns {JSX.Element}
 */
const SideSheet = ({
  children,
  okLabel,
  onClose,
  title = "",
  style = {},
  className,
}) => {
  return (
    <div className={`poly-side-sheet ${className || ""}`} style={style}>
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

      <div className="button-holder">
        <PolyButton
          className="poly-self-centered"
          label={okLabel}
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default SideSheet;
