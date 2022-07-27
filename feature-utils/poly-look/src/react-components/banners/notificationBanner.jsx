import React from "react";

import "./notificationBanner.css";

import standard from "../../static/images/icons/xmark-standard.svg";
import success from "../../static/images/icons/xmark-success.svg";
import error from "../../static/images/icons/xmark-error.svg";
import warning from "../../static/images/icons/xmark-warning.svg";

export const notificationTypes = {
  standard: "standard",
  success: "success",
  error: "error",
  warning: "warning",
};

/**
 * Notification Banner component - also used as a pop-up.
 *
 * @param {jsx} children JSX elements displayed inside the banner as a notification message.
 * @param {string} notificationType The notification type defines the styles and icon used in the component.
 * There are currently four notification options: standard, success, error and warning.
 * @param {callback} handleCloseNotification onClick function to close the notification.
 * @returns jsx
 */

export function NotificationBanner({
  children,
  notificationType,
  handleCloseNotification,
}) {
  const icons = {
    standard,
    success,
    error,
    warning,
  };
  return (
    <div className="notification-container">
      <div
        className={`notification-banner ${notificationTypes[notificationType]}`}
      >
        {children}
        <img
          src={icons[notificationType]}
          alt="close"
          onClick={handleCloseNotification}
        />
      </div>
    </div>
  );
}
