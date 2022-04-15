import React from "react";
import { render } from "@testing-library/react";
import { Card } from "../../../src/react-components";
import "@testing-library/jest-dom";

const testH1 = "TestH1";

const singleBasicCard = (
  <Card>
    <h1>{testH1}</h1>
  </Card>
);

it("renders the card correctly", () => {
  const renderedCard = render(singleBasicCard);
  expect(renderedCard.container).toBeTruthy();
});

it("renders the children correctly", () => {
  const { getByRole } = render(singleBasicCard);
  expect(getByRole("heading").innerHTML).toBe(testH1);
});
