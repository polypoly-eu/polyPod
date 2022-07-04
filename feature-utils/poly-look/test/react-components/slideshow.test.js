import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Slideshow } from "../../src/react-components";

/**
 * @jest-environment jsdom
 */
describe("Slideshow", () => {
  it("renders correctly", () => {
    const images = ["", ""];
    const { container, getAllByRole } = render(<Slideshow images={images} />);

    expect(container).toBeTruthy();
    expect(getAllByRole("img").length).toBe(images.length);
  });
});
