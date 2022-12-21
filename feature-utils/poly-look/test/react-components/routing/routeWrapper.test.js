import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RoutingWrapper } from "../../../src/react-components";
import { INITIAL_HISTORY_STATE } from "../../../src/constants";

let onClickTestVar;
const divTestOnClick = () => {
  onClickTestVar = true;
};
const testRoute = "/route";
const testStateChange = {
  scrollingProgress: 200,
};

const navigate = jest.fn();
const divTestId = "divTestId";
const testRouteWrapper = (
  <RoutingWrapper
    navigate={navigate}
    route={testRoute}
    stateChange={testStateChange}
  >
    <div data-testid={divTestId}></div>
  </RoutingWrapper>
);

const testonClickRouteWrapper = (
  <RoutingWrapper
    navigate={navigate}
    route={testRoute}
    stateChange={testStateChange}
  >
    <div data-testid={divTestId} onClick={divTestOnClick}></div>
  </RoutingWrapper>
);

const testNoStateChangeRouteWrapper = (
  <RoutingWrapper navigate={navigate} route={testRoute}>
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
    const [route, options] = navigate.mock.calls.at(-1);
    expect(route).toBe(testRoute);
    expect(options.state).toStrictEqual({
      ...INITIAL_HISTORY_STATE,
      ...testStateChange,
    });
  });

  it("manipulates history correctly and clicks onClick of children", () => {
    const { getByTestId } = render(testonClickRouteWrapper);
    fireEvent.click(getByTestId(divTestId));
    const [route, options] = navigate.mock.calls.at(-1);
    expect(route).toBe(testRoute);
    expect(options.state).toStrictEqual({
      ...INITIAL_HISTORY_STATE,
      ...testStateChange,
    });
    expect(onClickTestVar).toBe(true);
  });

  it("manipulates history correctly and clicks onClick of children", () => {
    const { getByTestId } = render(testNoStateChangeRouteWrapper);
    fireEvent.click(getByTestId(divTestId));
    const [route, options] = navigate.mock.calls.at(-1);
    expect(route).toBe(testRoute);
    expect(options.state).toStrictEqual(INITIAL_HISTORY_STATE);
  });
});
