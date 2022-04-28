import React from "react";
import BaseOverlay from "../../../src/react-components/overlays/base";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

const testClassName = "test1";
const testId = "testId";
const testComponent = (
  <BaseOverlay className={testClassName}>
    <div data-testid={testId}></div>
  </BaseOverlay>
);

const centeredTestComponent = (
  <BaseOverlay className={testClassName} centered={true}></BaseOverlay>
);

it("renders correctly", () => {
  const { container, getByTestId } = render(testComponent);
  expect(container).toBeTruthy();
  const baseOverlay = getByTestId("base-overlay-test");
  expect(baseOverlay.className).toContain("base-overlay");
  expect(baseOverlay.className).toContain(testClassName);
  expect(baseOverlay.className).not.toContain("centered");
  expect(getByTestId(testId)).toBeTruthy();
});

it("adds centered class when specified", () => {
  const { getByTestId } = render(centeredTestComponent);
  expect(getByTestId("base-overlay-test").className).toContain("centered");
});
