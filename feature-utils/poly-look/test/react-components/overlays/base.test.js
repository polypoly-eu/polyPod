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

describe("baseOverlay", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(testComponent);
    const baseOverlay = getByTestId("base-overlay-test");
    expect(baseOverlay.className).toContain("base-overlay");
    expect(baseOverlay.className).toContain(testClassName);
    expect(getByTestId(testId)).toBeTruthy();
  });
});
