class MockImporterClass {
  constructor() {
    this.import = ({ zipFile, facebookAccount, pod }) => true;
  }
}
export const mockDataImporters = [MockImporterClass];
