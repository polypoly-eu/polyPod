class MockImporter {
  import() {
    return true;
  }
}
export const mockDataImporters = [
  { importerClass: MockImporter, storageKey: "mock" },
];
