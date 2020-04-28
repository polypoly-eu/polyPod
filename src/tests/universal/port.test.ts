import {portSpec} from "../../specs/port";
import {forwardLifecycle, loopbackLifecycle} from "../_lifecycles";

describe("Universal/Port", () => {

    describe("Loopback", () => {

        portSpec(loopbackLifecycle);

    });

    describe("Forward", () => {

        portSpec(forwardLifecycle(loopbackLifecycle, loopbackLifecycle));

    });

});
