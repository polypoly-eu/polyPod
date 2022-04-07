import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { Card, CardList } from "../../src/react-components";
import "@testing-library/jest-dom";
import { HistoryStub } from "../utils/history-stub";
import { INITIAL_HISTORY_STATE } from "../../src/constants";

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
  buttonText: testButtonText,
};

const singleNavigationCard = (
  <Card navigation={testRouteNavigation}>
    <h1>{testH1}</h1>
  </Card>
);

const cardWithNoButtonText = (
  <Card navigation={{ ...testRouteNavigation, buttonText: null }}></Card>
);

const cardWithNoHistory = (
  <Card
    navigation={{ ...testRouteNavigation, history: null, onClick: null }}
  ></Card>
);

const cardWithNoRoute = (
  <Card
    navigation={{ ...testRouteNavigation, route: null, onClick: null }}
  ></Card>
);

const buttonErrorText = "Card: DetailsButton must have text";

const navigationErrorText =
  "Card: Navigation either needs history and route or onClick";

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
    expect(button.innerHTML).toBe(testButtonText);
    fireEvent.click(renderedCard.container.querySelector(".card"));
    expect(clickedCard).toBeTruthy();
    expect(history.route).toBe(testRoute);
    expect(history.state).toStrictEqual({
      ...INITIAL_HISTORY_STATE,
      ...testStateChange,
    });
  });

  it("shows the right errors for no buttonText", () => {
    let errorText;
    const consoleSpy = jest.spyOn(console, "error").mockImplementation((e) => {
      errorText = e;
    });
    render(cardWithNoButtonText);
    expect(consoleSpy).toHaveBeenCalled();
    expect(errorText).toContain(buttonErrorText);
  });

  it("shows the right errors for no history", () => {
    let errorText;
    const consoleSpy = jest.spyOn(console, "error").mockImplementation((e) => {
      errorText = e;
    });
    render(cardWithNoHistory);
    expect(consoleSpy).toHaveBeenCalled();
    expect(errorText).toContain(navigationErrorText);
  });

  it("shows the right errors for no history", () => {
    let errorText;
    const consoleSpy = jest.spyOn(console, "error").mockImplementation((e) => {
      errorText = e;
    });
    render(cardWithNoHistory);
    expect(consoleSpy).toHaveBeenCalled();
    expect(errorText).toContain(navigationErrorText);
  });

  it("shows the right errors for no route", () => {
    let errorText;
    const consoleSpy = jest.spyOn(console, "error").mockImplementation((e) => {
      errorText = e;
    });
    render(cardWithNoRoute);
    expect(consoleSpy).toHaveBeenCalled();
    expect(errorText).toContain(navigationErrorText);
  });
});

const testCardList = (
  <CardList>
    <Card></Card>
  </CardList>
);

describe("cardList", () => {
  it("renders correctly", () => {
    const { container } = render(testCardList);
    expect(container).toBeTruthy();
    expect(container.querySelector(".card")).toBeTruthy();
  });
});
