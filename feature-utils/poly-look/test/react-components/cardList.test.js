import React from "react";
import { render } from "@testing-library/react";
import { Card, CardList } from "../../src/react-components";

const testH1 = "TestH1";

const singleBasicCard = (
  <Card>
    <h1>{testH1}</h1>
  </Card>
);

describe("Card works as expected", () => {
  it("renders the card correctly", () => {
    const renderedCard = render(singleBasicCard);
    expect(renderedCard.container).toBeTruthy();
  });

  it("renders the children correctly", () => {
    const { getByText } = render(singleBasicCard);
    expect(getByText(testH1)).toBeInTheDocument();
  });
});
