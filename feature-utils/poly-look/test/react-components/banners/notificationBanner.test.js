import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  NotificationBanner,
  notificationTypes,
} from "../../../src/react-components";

/**
 * @jest-environment jsdom
 */

const children = "Pop Up content";
const mockedHandleClick = jest.fn();

describe("NotificationBanner component", () => {
  beforeEach(() => {
    render(
      <NotificationBanner
        notificationType={notificationTypes.standard.class}
        handleCloseNotification={mockedHandleClick}
      >
        {children}
      </NotificationBanner>
    );
  });

  it("renders correctly", () => {
    expect(screen.getByText(children)).toBeTruthy();
  });

  it("closes when clicking on the icon", () => {
    fireEvent.click(screen.getByRole("img"), mockedHandleClick);
    expect(mockedHandleClick).toHaveBeenCalled();
  });
});

describe("NotificationBanner styles", () => {
  it("changes depending on notification type", () => {
    for (let notificationType in notificationTypes) {
      const { getByText } = render(
        <NotificationBanner notificationType={notificationType}>
          {children + notificationType}
        </NotificationBanner>
      );
      expect(getByText(children + notificationType)).toHaveClass(
        `notification-banner ${notificationType}`
      );
    }
  });
});
