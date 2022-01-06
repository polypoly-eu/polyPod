import { Chips } from "../../../src/react";
import React from "react";
import { mount } from "@cypress/react";

const chipsContent = [
  { id: "chip1", translation: "Chip 1" },
  { id: "chip2", translation: "Chip 2" },
  { id: "chip3", translation: "Chip 3" },
];

const onChipClick = (id, activeChips) => console.log(id, activeChips);

describe("renders Chips", () => {
  it("renders correctly", () => {
    mount(
      <Chips
        chipsContent={chipsContent}
        defaultActiveChips={[chip1]}
        onChipClick={onChipClick}
      />
    );
    cy.get(".poly-chips").should("exist");
  });
});
