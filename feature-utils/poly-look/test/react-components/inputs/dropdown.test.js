import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Dropdown } from "../../../src/react-components/";

describe("Dropdown", () => {
  const options = [
    { id: 0, value: "zero" },
    { id: 1, value: "one" },
    { id: 2, value: "two" },
  ];
  const emptyFunc = () => {};

  describe("rendering", () => {
    it("basic", () => {
      render(
        <Dropdown
          name="test"
          helperText="helper"
          label="label"
          options={[]}
          onChange={emptyFunc}
        />
      );
      expect(document.querySelector("input")).toHaveAttribute("value", "");
      expect(screen.getByText("helper")).toBeTruthy();
      expect(screen.getByText("label")).toBeTruthy();
      expect(screen.getByTestId("chevron-down")).toBeVisible();
    });

    it("pre filled", () => {
      render(
        <Dropdown
          initialSelection={options[0]}
          options={options}
          onChange={emptyFunc}
        />
      );
      expect(document.querySelector("input")).toHaveAttribute(
        "value",
        options[0].value
      );
    });

    it("focused state", () => {
      render(<Dropdown tabIndex={1} options={options} onChange={emptyFunc} />);

      const inputBody = screen.getByTestId("input-focusable");
      const optionsContainer = document.querySelector(".list-holder");
      const label = document.querySelector("label");

      expect(label).not.toHaveClass("label-up");
      expect(inputBody).not.toHaveClass("body-focused");
      expect(optionsContainer).not.toBeVisible();

      inputBody.focus();

      expect(inputBody).toHaveClass("body-focused");
      expect(optionsContainer).toBeVisible();
      expect(label).toHaveClass("label-up");

      options.forEach((option) =>
        expect(screen.getByText(option.value)).toBeVisible()
      );
    });

    it("error state", () => {
      render(<Dropdown options={[]} onChange={emptyFunc} error={true} />);
      const inputBody = screen.getByTestId("input-focusable");
      expect(inputBody).toHaveClass("body-error");
    });

    it("disabled state", () => {
      render(<Dropdown options={[]} onChange={emptyFunc} disabled={true} />);

      const inputBody = screen.getByTestId("input-focusable");
      expect(inputBody).toHaveClass("body-disabled");
    });
  });

  describe("user flow", () => {
    it("no initial value", () => {
      let changeHandler = jest.fn();
      render(
        <Dropdown
          name="test"
          options={options}
          onChange={changeHandler}
          noMatch="no matches"
          tabIndex={1}
        />
      );

      const inputBody = screen.getByTestId("input-focusable");
      const input = document.querySelector("input");

      expect(screen.queryByText("no matches")).toBeNull();
      inputBody.focus();

      fireEvent.change(input, { target: { value: "2" } });
      expect(screen.queryByText("no matches")).toBeTruthy();

      fireEvent.change(input, { target: { value: "n" } });

      expect(screen.queryByText(options[0].value)).toBeNull();
      expect(screen.queryByText(options[2].value)).toBeNull();
      expect(screen.getByText(options[1].value)).toBeTruthy();

      input.blur();
      expect(changeHandler).toHaveBeenCalledWith({
        id: null,
        value: null,
        name: "test",
      });

      inputBody.focus();
      fireEvent.click(screen.getByText(options[1].value));
      expect(changeHandler).toHaveBeenCalledWith({
        ...options[1],
        name: "test",
      });
    });

    it("with initial value", () => {
      let changeHandler = jest.fn();
      render(
        <Dropdown
          name="test"
          options={options}
          onChange={changeHandler}
          noMatch="no matches"
          tabIndex={1}
          initialSelection={options[0]}
        />
      );

      const inputBody = screen.getByTestId("input-focusable");

      inputBody.focus();
      options.forEach((option) =>
        expect(screen.getByText(option.value)).toBeVisible()
      );

      fireEvent.click(screen.getByText(options[1].value));
      expect(changeHandler).toHaveBeenCalledWith({
        ...options[1],
        name: "test",
      });
    });
  });
});
