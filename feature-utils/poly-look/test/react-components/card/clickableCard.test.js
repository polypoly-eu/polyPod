import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { ClickableCard } from "../../../src/react-components";
import "@testing-library/jest-dom";

const testH1 = "TestH1";

let isClicked = false;
const onClick = () => {
  isClicked = true;
};

const buttonText = "ButtonText";

const singleBasicCard = (
  <ClickableCard onClick={onClick}>
    <h1>{testH1}</h1>
  </ClickableCard>
);

const singleButtonCard = (
  <ClickableCard onClick={onClick} buttonText={buttonText}>
    <h1>{testH1}</h1>
  </ClickableCard>
);

const onlyButtonClickCard = (
  <ClickableCard
    onClick={onClick}
    buttonText={buttonText}
    onlyButtonClickEvent={true}
  >
    <h1>{testH1}</h1>
  </ClickableCard>
);

beforeEach(() => {
  isClicked = false;
});

it("renders the card correctly", () => {
  const { container } = render(singleBasicCard);
  expect(container).toBeTruthy();
});

it("renders the children correctly", () => {
  const { getByRole } = render(singleBasicCard);
  expect(getByRole("heading").innerHTML).toBe(testH1);
});

it("correctly registers onClick in card", () => {
  const { container } = render(singleBasicCard);
  fireEvent.click(container.querySelector(".card"));
  expect(isClicked).toBeTruthy();
});

it("doesn't show button when text is not added", () => {
  const { container } = render(singleBasicCard);
  expect(container.querySelector(".poly-button")).toBeFalsy();
});

it("shows button when text is added", () => {
  const { container } = render(singleButtonCard);
  expect(container.querySelector(".poly-button")).toBeTruthy();
  expect(container.querySelector(".poly-button").innerHTML).toBe(buttonText);
});

it("only enables buttonClick", () => {
  const { container } = render(onlyButtonClickCard);
  console.log(isClicked);
  fireEvent.click(container.querySelector(".card"));
  console.log(isClicked);
  expect(isClicked).toBeFalsy();
  fireEvent.click(container.querySelector(".poly-button"));
  expect(isClicked).toBeTruthy();
});
