import {portSpec} from "../../specs/port";
import {bubblewrapLifecycle, forwardLifecycle, loopbackLifecycle} from "../_lifecycles";
import {Bubblewrap} from "@polypoly-eu/bubblewrap";

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

});
