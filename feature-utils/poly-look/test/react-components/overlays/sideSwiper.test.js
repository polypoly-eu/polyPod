import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SideSwiper } from "../../../src/react-components";

/**
 * @jest-environment jsdom
 */
const SliderContent = (props) => {
  return (
    <div {...props}>
      Contents
      <button onClose={props.onClose}>Close</button>
    </div>
  );
};

describe("Basic props", () => {
  it("Creates a SideSwiper with contents", () => {
    const rendered = render(<SideSwiper Component={SliderContent} />);
    expect(rendered.container).toBeTruthy();
    expect(rendered.getByText("Contents")).toBeTruthy();
  });

  it("Applies the custom styles correctly", () => {
    const left = 50;
    const backdropColor = [1, 2, 3, 0.7];
    const animDuration = "0.1s";
    const { container } = render(
      <SideSwiper
        open={true}
        Component={SliderContent}
        leftDistance={`${left}px`}
        backdropColor={backdropColor}
        animationDuration={animDuration}
      />
    );
    let backdropStyle = getComputedStyle(container.querySelector(".backdrop"));
    let contentsStyle = getComputedStyle(container.querySelector(".contents"));

    //backdrop customization
    expect(
      backdropStyle.getPropertyValue("background-color").replace(/\s+/g, "")
    ).toBe(`rgba(${backdropColor.toString()})`);
    expect(backdropStyle.getPropertyValue("transition-duration")).toBe(
      animDuration
    );
    //contents customization
    expect(contentsStyle.getPropertyValue("transform")).toBe(
      `translateX(${left}px)`
    );
    expect(contentsStyle.getPropertyValue("transition-duration")).toBe(
      animDuration
    );
  });
});
