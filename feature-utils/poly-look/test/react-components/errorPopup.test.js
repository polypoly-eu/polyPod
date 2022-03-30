import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorPopup } from "../../src/react-components";

/**
 * @jest-environment jsdom
 */
const testError = new Error("Test Error!");

const feedbackMail = "polypod-feedback@polypoly.coop";

let closedPopup = false;
const callback = () => {
  closedPopup = true;
};
const errorText = {
  title: "Test text",
  instructionsIntro: "This is an intro",
  instructionsSteps: "These are steps. Please contact: {{emailAdress}}",
  instructionsClosing: "Thank you",
};

const errorPopup = (
  <ErrorPopup error={testError} onClose={callback} text={errorText} />
);

it("Creates an Error Popup", () => {
  const renderedErrorPopup = render(errorPopup);
  expect(renderedErrorPopup.container).toBeTruthy();
});

it("Creates an Error Popup with correct Texts", () => {
  const { getByText } = render(errorPopup);
  Object.values(errorText).forEach((text) => {
    if (text.includes("{{emailAdress}}")) {
      const button = getByText(feedbackMail);
      expect(button).toBeTruthy();
    } else {
      expect(getByText(text)).toBeTruthy();
    }
  });
});

it("Checks onClose is called", () => {
  const { getByText } = render(errorPopup);
  expect(getByText("Close")).toBeInTheDocument();
  fireEvent.click(getByText("Close"));
  expect(closedPopup).toBe(true);
});
