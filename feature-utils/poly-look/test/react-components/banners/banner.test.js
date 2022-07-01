import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HistoryStub } from "../../utils/history-stub";
import { Banner } from "../../../src/react-components";

/**
 * @jest-environment jsdom
 */
it("Banner renders correctly", () => {
  const { container, getByText, getByRole } = render(
    <Banner title="Title" description="Description" icon="icon.svg" />
  );

  expect(container).toBeTruthy();
  expect(getByText("Title")).toBeTruthy();
  expect(getByText("Description")).toBeTruthy();
  expect(getByRole("img")).toBeTruthy();
});

it("Clicking the button leads to the correct route", () => {
  const history = new HistoryStub();

  const { getByText } = render(
    <Banner button={{ label: "Label", route: "/route", history: history }} />
  );
  const buttonElement = getByText("Label");
  fireEvent.click(buttonElement);
  expect(history.route).toBe("/route");
});
