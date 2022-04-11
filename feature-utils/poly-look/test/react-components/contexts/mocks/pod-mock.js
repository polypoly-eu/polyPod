export const MOCKED_POD_RUNTIME = "podjs-mock";
export const MOCKED_POD_RUNTIME_VERSION = "podjs-mock-version";
export const mockFiles = [{ id: "mockFilename1" }, { id: "mockFilename2" }];

class MockerPodInfo {
  async getRuntime() {
    return MOCKED_POD_RUNTIME;
  }

  async getVersion() {
    return MOCKED_POD_RUNTIME_VERSION;
  }
}

export class MockerPod {
  constructor() {
    this._polyOut = {
      readDir: () => mockFiles,
      stat: (id) => id,
      removeArchive: () => null,
    };
  }
  get info() {
    return new MockerPodInfo();
  }
  get polyOut() {
    return this._polyOut;
  }
}
