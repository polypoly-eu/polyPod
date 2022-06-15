import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { IconButton } from "../../../src/react-components";

describe("IconButton", () => {
  test("Creates a basic button", () => {
    const onClick = jest.fn();
    const { getByRole } = render(
      <IconButton icon="angleRight" onClick={onClick} />
    );
    expect(getByRole("button")).toBeTruthy();
    expect(getByRole("img")).toBeTruthy();
    fireEvent.click(getByRole("button"));
    expect(onClick).toBeCalled();
  });

  test("Created a filled button", () => {
    let { container } = render(
      <IconButton icon="angleRight" fillDirection="left" />
    );
    expect(container.querySelector(".filled-left")).toBeTruthy();
    //re-render
    render(<IconButton icon="angleRight" fillDirection="right" />, {
      container,
    });
    expect(container.querySelector(".filled-right")).toBeTruthy();
  });
});
