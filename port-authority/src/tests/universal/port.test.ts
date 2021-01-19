import { portSpec } from "../../specs/port";
import { bubblewrapLifecycle, forwardLifecycle, loopbackLifecycle } from "../_lifecycles";
import { Bubblewrap } from "@polypoly-eu/bubblewrap";
import { receiveSingle } from "../../port";
import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

describe("Universal/Port", () => {
    describe("Loopback", () => {
        portSpec(loopbackLifecycle);
    });

    describe("Bubblewrap", () => {
        portSpec(bubblewrapLifecycle(loopbackLifecycle, Bubblewrap.create()));
    });

    describe("Forward", () => {
        portSpec(forwardLifecycle(loopbackLifecycle, loopbackLifecycle));
    });

    it("receiveSingle", async () => {
        const [send, receive] = (await loopbackLifecycle<number>()).value;
        const promise = receiveSingle(receive);
        send.send(1);
        send.send(2);
        await assert.eventually.equal(promise, 1);
    });
});
