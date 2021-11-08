class MockerPodInfo {
    async getRuntime() {
        return "podjs-mock";
    }

    async getVersion() {
        return "podjs-mock-version";
    }
}

export class MockerPod {
    get info() {
        return new MockerPodInfo();
    }
}
