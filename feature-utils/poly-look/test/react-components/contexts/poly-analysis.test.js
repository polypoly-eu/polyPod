import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PolyImportProvider } from "../../../src/react-components";
import {
  MockParentContext,
  MockParentContextProvider,
} from "./mocks/parent-context-mock";
import MockDataAccount from "./mocks/data-account-mock";
import { mockDataImporters } from "./mocks/data-importers-mock";
import mockPolyImportComponent from "./mocks/poly-import-component-mock";

/**
 * @jest-environment jsdom
 */

const mockComponent = (
  <MockParentContextProvider>
    <PolyImportProvider
      parentContext={MockParentContext}
      dataImporters={mockDataImporters}
      DataAccount={MockDataAccount}
    >
      <mockPolyImportComponent />
    </PolyImportProvider>
  </MockParentContextProvider>
);

it("Creates an Error Popup", () => {
  const renderedErrorPopup = render(mockComponent);
  expect(renderedErrorPopup.container).toBeTruthy();
});
