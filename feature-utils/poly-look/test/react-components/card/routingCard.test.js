import React from "react";
import { fireEvent, render } from "@testing-library/react";

import { RoutingCard } from "../../../src/react-components";
import { HistoryStub } from "../../utils/history-stub";
import { INITIAL_HISTORY_STATE } from "../../../src/constants";

const history = new HistoryStub();
const testRoute = "/route";
const testStateChange = {
  scrollingProgress: 200,
};

const basicRoutingCard = (
  <RoutingCard
    history={history}
    route={testRoute}
    stateChange={testStateChange}
  />
);

it("tests history routing ", () => {
  const { container } = render(basicRoutingCard);
  fireEvent.click(container.querySelector(".card"));
  expect(history.route).toBe(testRoute);
  expect(history.state).toStrictEqual({
    ...INITIAL_HISTORY_STATE,
    ...testStateChange,
  });
});
