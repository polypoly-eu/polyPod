export const MOCKED_POD_RUNTIME = "podjs-mock";
export const MOCKED_POD_RUNTIME_VERSION = "podjs-mock-version";

class MockerPodInfo {
    async getRuntime() {
        return MOCKED_POD_RUNTIME;
    }

    async getVersion() {
        return MOCKED_POD_RUNTIME_VERSION;
    }
}

export class MockerPod {
    get info() {
        return new MockerPodInfo();
    }
}
