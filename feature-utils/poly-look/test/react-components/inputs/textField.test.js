import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TextField } from "../../../src/react-components/";

describe("TextField", () => {
  describe("rendering", () => {
    it("basic", () => {
      render(<TextField name="test" helperText="helper" label="label" />);

      expect(document.querySelector("input")).toHaveAttribute("value", "");

      expect(screen.getByText("helper")).toBeTruthy();
      expect(screen.getByText("label")).toBeTruthy();
      expect(screen.getByTestId("triangle-exclamation")).not.toBeVisible();
    });

    it("pre filled", () => {
      render(<TextField value="test" />);
      expect(document.querySelector("input")).toHaveAttribute("value", "test");
    });

    it("focused state", () => {
      render(<TextField tabIndex={1} />);
      const inputBody = screen.getByTestId("input-focusable");

      expect(inputBody).not.toHaveClass("body-focused");
      inputBody.focus();
      expect(inputBody).toHaveClass("body-focused");
    });

    it("error state", () => {
      render(<TextField error={true} />);
      const inputBody = screen.getByTestId("input-focusable");
      const errorIcon = screen.getByTestId("triangle-exclamation");
      const clearIcon = screen.getByTestId("circle-xmark");

      expect(errorIcon).toBeVisible();
      expect(clearIcon).not.toBeVisible();

      inputBody.focus();
      expect(errorIcon).not.toBeVisible();
      expect(clearIcon).toBeVisible();
    });

    it("disabled state", () => {
      render(<TextField disabled={true} />);
      const inputBody = screen.getByTestId("input-focusable");
      expect(inputBody).toHaveClass("body-disabled");
    });
  });

  describe("user flow", () => {
    function setup(value = "") {
      const changeHandler = jest.fn();
      const { rerender } = render(
        <TextField
          name="test"
          tabIndex={1}
          onChange={changeHandler}
          value={value}
          label="label"
        />
      );
      return {
        changeHandler,
        updateValue: (newValue) =>
          rerender(
            <TextField
              name="test"
              tabIndex={1}
              onChange={changeHandler}
              value={newValue}
              label="label"
            />
          ),
        elements: {
          inputBody: screen.getByTestId("input-focusable"),
          clearIcon: screen.getByTestId("circle-xmark"),
          input: document.querySelector("input"),
          label: document.querySelector("label"),
        },
      };
    }

    it("no initial value", async () => {
      const { changeHandler, updateValue, elements } = setup();

      //the label is "inside" the input field
      expect(elements.label).not.toHaveClass("label-up");

      //the user "clicks" on the input
      //note: fireEvent.click(inputBody) makes the toHaveFocus() assertion fail
      //so we trigger the focus directly
      elements.inputBody.focus();
      expect(elements.input).toHaveFocus();
      expect(elements.clearIcon).not.toBeVisible();
      //the label is moved up a fex pixels
      expect(elements.label).toHaveClass("label-up");

      //the user inputs something
      fireEvent.change(elements.input, { target: { value: "2" } });

      //parent component is notified of the change
      expect(changeHandler).toHaveBeenCalledWith({ value: "2", name: "test" });
      await waitFor(() => updateValue("2"));

      //input value can be cleared
      expect(elements.clearIcon).toBeVisible();

      //simulate user clicking elsewhere
      //note: inputBody.blur() doesn't seem to work
      elements.input.blur();
      expect(elements.input).not.toHaveFocus();
      expect(elements.clearIcon).not.toBeVisible();

      //bring back the focus
      elements.inputBody.focus();
      //the user clears the input
      fireEvent.click(elements.clearIcon);
      //parent component is notified of the change
      expect(changeHandler).toHaveBeenCalledWith({ value: "", name: "test" });
      await waitFor(() => updateValue(""));
      expect(elements.clearIcon).not.toBeVisible();
      //the user can continue typing without needing to click on the field again
      expect(elements.input).toHaveFocus();
    });

    it("with initial value", () => {
      const { changeHandler, elements } = setup("123");

      expect(elements.clearIcon).not.toBeVisible();

      elements.inputBody.focus();
      expect(elements.clearIcon).toBeVisible();

      fireEvent.click(elements.clearIcon);
      expect(elements.input).toHaveFocus();
      expect(changeHandler).toHaveBeenCalledWith({ value: "", name: "test" });
    });
  });
});
