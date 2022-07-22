import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NotificationBanner, types } from "../../../src/react-components";

/**
 * @jest-environment jsdom
 */

const children = "Pop Up content";
const mockedHandleClick = jest.fn();

describe("NotificationBanner component", () => {
  beforeEach(() => {
    render(
      <NotificationBanner
        notificationType={types.standard.class}
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
    for (let type in types) {
      const { getByText } = render(
        <NotificationBanner notificationType={type}>
          {children + type}
        </NotificationBanner>
      );
      expect(getByText(children + type)).toHaveClass(
        `notification-banner ${type}`
      );
    }
  });
});
