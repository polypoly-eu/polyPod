import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Banner } from "../../../src/react-components";

/**
 * @jest-environment jsdom
 */

it("Banner renders correctly", () => {
  const title = "Title";
  const description = "Description";
  const { container, getByText, getByRole } = render(
    <Banner title={title} description={description} icon="icon.svg" />
  );

  expect(container).toBeTruthy();
  expect(getByText(title)).toBeTruthy();
  expect(getByText(description)).toBeTruthy();
  expect(getByRole("img")).toBeTruthy();
});

it("Clicking the button leads to the correct route", () => {
  const navigate = jest.fn();
  const label = "Label";
  const mockedRoute = "/route";

  const { getByText } = render(
    <Banner button={{ label: label, route: mockedRoute, navigate: navigate }} />
  );
  fireEvent.click(getByText(label));
  expect(navigate.mock.calls.at(-1)[0]).toBe(mockedRoute);
});
