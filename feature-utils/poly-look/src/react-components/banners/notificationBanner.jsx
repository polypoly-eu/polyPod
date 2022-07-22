import React from "react";

import "./notificationBanner.css";

import standard from "../../static/images/icons/xmark-standard.svg";
import success from "../../static/images/icons/xmark-success.svg";
import error from "../../static/images/icons/xmark-error.svg";
import warning from "../../static/images/icons/xmark-warning.svg";

export const types = {
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
    <div className="notification-pop-up-container">
      <div className={`notification-banner ${types[notificationType].class}`}>
        {children}
        <img
          src={types[notificationType].icon}
          alt="close"
          onClick={handleCloseNotification}
        />
      </div>
    </div>
  );
}
