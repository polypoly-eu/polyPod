import React from "react";

import "./notificationBanner.css";

import standard from "../../static/images/icons/xmark-standard.svg";
import success from "../../static/images/icons/xmark-success.svg";
import error from "../../static/images/icons/xmark-error.svg";
import warning from "../../static/images/icons/xmark-warning.svg";

export const notificationTypes = {
  standard: { class: "standard", icon: standard },
  success: { class: "success", icon: success },
  error: { class: "error", icon: error },
  warning: { class: "warning", icon: warning },
};

export function NotificationBanner({
  children,
  notificationType,
  handleCloseNotification,
}) {
  return (
    <div className="notification-container">
      <div
        className={`notification-banner ${notificationTypes[notificationType].class}`}
      >
        {children}
        <img
          src={notificationTypes[notificationType].icon}
          alt="close"
          onClick={handleCloseNotification}
        />
      </div>
    </div>
  );
}
