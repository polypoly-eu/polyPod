export const MOCKED_POD_RUNTIME = "podjs-mock";
export const MOCKED_POD_RUNTIME_VERSION = "podjs-mock-version";
export const mockFiles = [{ id: "mockFilename1" }, { id: "mockFilename2" }];

const mockStorage = {
  mockFilename1: "mockFilename1",
  mockFilename2: "mockFilename2",
};

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
    this._mockStorage = mockStorage;
    this._polyOut = {
      readDir: () =>
        Object.values(this._mockStorage).map((file) => ({
          id: file,
        })),
      stat: (id) => id,
      removeArchive: (id) => {
        this._mockStorage[id] && delete this._mockStorage[id];
      },
    };
  }
  get info() {
    return new MockerPodInfo();
  }
  get polyOut() {
    return this._polyOut;
  }
}
