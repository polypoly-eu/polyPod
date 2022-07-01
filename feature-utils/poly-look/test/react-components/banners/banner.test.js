import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Banner } from "../../../src/react-components";

/**
 * @jest-environment jsdom
 */
describe("Banner", () => {
  it("renders correctly", () => {
    const { container, getByText, getByRole } = render(
      <Banner
        title="Title"
        description="Description"
        icon="icon.svg"
        button={{ label: "Label" }}
      />
    );

    expect(container).toBeTruthy();
    expect(getByText("Title")).toBeTruthy();
    expect(getByText("Description")).toBeTruthy();
    expect(getByRole("img")).toBeTruthy();
  });

  // it("has a functional button", () => {
  //   const mockedClickEvent = jest.fn();

  //   const { getByText } = render(
  //     <Banner button={{ label: "Label", route: "/route" }} />
  //   );
  //   const buttonElement = getByText("/route");
  //   console.log(buttonElement);
  //   fireEvent.click(buttonElement, mockedClickEvent);
  //   expect(mockedClickEvent).toHaveBeenCalled();
  // });
});
