import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PolyImportProvider } from "../../../src/react-components";
import {
  MockParentContext,
  MockParentContextProvider,
} from "./mocks/parent-context-mock";
import MockDataAccount from "./mocks/data-account-mock";
import MockPolyImportComponent from "./mocks/poly-import-component-mock";
import { mockDataImporters } from "./mocks/data-importers-mock";
import { mockFiles } from "./mocks/pod-mock";
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
      <MockPolyImportComponent />
    </PolyImportProvider>
  </MockParentContextProvider>
);

it("Creates a MockContext", async () => {
  const { container } = render(mockComponent);
  await waitFor(() => {
    expect(container).toBeTruthy();
  });
});

it("Reacts to changes in Pod file-storage", async () => {
  const { container } = await waitFor(() => render(mockComponent));
  const elements = container.getElementsByTagName("p");
  mockFiles.forEach((file, i) =>
    expect(elements.item(i).firstChild.textContent).toBe(file.id)
  );
});
