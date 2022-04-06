import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { Card, CardList } from "../../src/react-components";
import "@testing-library/jest-dom";
import { INITIAL_HISTORY_STATE } from "../../src/poly-look";

const testH1 = "TestH1";

const singleBasicCard = (
  <Card>
    <h1>{testH1}</h1>
  </Card>
);

//testing navigation
let clickedCard;
const history = new HistoryStub();
const testRoute = "/testRoute";
const testStateChange = { scrollingProgress: 200 };
const testOnClick = () => {
  clickedCard = true;
};
const testButtonText = "Details";
const testRouteNavigation = {
  history,
  route: testRoute,
  onClick: testOnClick,
  stateChange: testStateChange,
  testButtonText,
};

const singleNavigationCard = (
  <Card navigation={testRouteNavigation}>
    <h1>{testH1}</h1>
  </Card>
);

describe("Card", () => {
  it("renders the card correctly", () => {
    const renderedCard = render(singleBasicCard);
    expect(renderedCard.container).toBeTruthy();
  });

  it("renders the children correctly", () => {
    const { getByText } = render(singleBasicCard);
    expect(getByText(testH1)).toBeInTheDocument();
  });

  it("correctly works with navigation", () => {
    const renderedCard = render(singleNavigationCard);
    const button = renderedCard.getByRole("button");
    expect(button.innerText).toBe(testButtonText);
    fireEvent.click(renderedCard);
    expect(clickedCard).toBeTruthy();
    expect(history.route).toBe(testRoute);
    expect(history.state).toBe({ ...INITIAL_HISTORY_STATE, ...stateChange });
  });
});
