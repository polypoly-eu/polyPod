import { portSpec } from "../../specs/port";
import { forwardLifecycle, flipLifecycle } from "../_lifecycles";
import { nodeLoopbackLifecycle } from "./_common";

describe("Node/Port", () => {
    describe("Loopback", () => {
        portSpec(nodeLoopbackLifecycle);

        describe("Flipped", () => {
            portSpec(flipLifecycle(nodeLoopbackLifecycle));
        });
    });

    describe("Forward", () => {
        portSpec(forwardLifecycle(nodeLoopbackLifecycle, nodeLoopbackLifecycle));
    });
});
