import { Telemetry } from "../src";

describe("Telemetry measures performance ", () => {
    let telemetry;
    beforeAll(() => {
        telemetry = new Telemetry();
    });

    it("Returns increasing elapsed time", () => {
        const oldTime = telemetry.elapsedTime();
        expect(oldTime).toBeGreaterThan(0);
        expect(telemetry.elapsedTime()).toBeGreaterThan(oldTime);
    });
});
