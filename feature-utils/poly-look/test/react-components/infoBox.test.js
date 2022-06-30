import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import InfoBox from "../../src/react-components/infoBox.jsx";

const textContent = "InfoBox text";

it("InfoBox is rendered", () => {
  const { container } = render(<InfoBox textContent={textContent} />);
  expect(container).toBeInTheDocument();
});
