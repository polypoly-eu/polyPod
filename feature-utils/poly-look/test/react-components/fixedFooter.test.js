import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { FixedFooter } from "../../src/react-components";

/**
 * @jest-environment jsdom
 */

const children = "Content inside the footer";

describe("Fixed Footer", () => {
  beforeEach(() => {
    render(<FixedFooter>{children}</FixedFooter>);
  });

  it("stays fixed at the bottom", () => {
    const fixedFooterElement = screen.getByText(children);
    expect(fixedFooterElement).toHaveClass("poly-fixed-footer");
  });

  it("has a gradient band on top", () => {
    const fixedFooterElement = screen.getByText(children);
    expect(fixedFooterElement).toHaveClass("poly-fixed-footer-gradient");
  });
});

it("Fixed footer doesn't have a gradient band on top", () => {
  render(<FixedFooter gradient={false}>{children}</FixedFooter>);
  const fixedFooterElement = screen.getByText(children);
  expect(fixedFooterElement).not.toHaveClass("poly-fixed-footer-gradient");
});
