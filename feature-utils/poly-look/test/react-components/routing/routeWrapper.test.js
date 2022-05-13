import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RoutingWrapper } from "../../../src/react-components";
import { HistoryStub } from "../../utils/history-stub";
import { INITIAL_HISTORY_STATE } from "../../../src/constants";

let onClickTestVar;
const divTestOnClick = () => {
  onClickTestVar = true;
};
const testRoute = "/route";
const testStateChange = {
  scrollingProgress: 200,
};

const history = new HistoryStub();
const divTestId = "divTestId";
const testRouteWrapper = (
  <RoutingWrapper
    history={history}
    route={testRoute}
    stateChange={testStateChange}
  >
    <div data-testid={divTestId}></div>
  </RoutingWrapper>
);

const testonClickRouteWrapper = (
  <RoutingWrapper
    history={history}
    route={testRoute}
    stateChange={testStateChange}
  >
    <div data-testid={divTestId} onClick={divTestOnClick}></div>
  </RoutingWrapper>
);

const testNoStateChangeRouteWrapper = (
  <RoutingWrapper history={history} route={testRoute}>
    <div data-testid={divTestId}></div>
  </RoutingWrapper>
);

describe("RoutingWrapper", () => {
  beforeEach(() => {
    onClickTestVar = false;
  });

  it("manipulates history correctly without onClick of children", () => {
    const { getByTestId } = render(testRouteWrapper);
    fireEvent.click(getByTestId(divTestId));
    expect(history.route).toBe(testRoute);
    expect(history.state).toStrictEqual({
      ...INITIAL_HISTORY_STATE,
      ...testStateChange,
    });
  });

  it("manipulates history correctly and clicks onClick of children", () => {
    const { getByTestId } = render(testonClickRouteWrapper);
    fireEvent.click(getByTestId(divTestId));
    expect(history.route).toBe(testRoute);
    expect(history.state).toStrictEqual({
      ...INITIAL_HISTORY_STATE,
      ...testStateChange,
    });
    expect(onClickTestVar).toBe(true);
  });

  it("manipulates history correctly and clicks onClick of children", () => {
    const { getByTestId } = render(testNoStateChangeRouteWrapper);
    fireEvent.click(getByTestId(divTestId));
    expect(history.route).toBe(testRoute);
    expect(history.state).toStrictEqual(INITIAL_HISTORY_STATE);
  });
});
