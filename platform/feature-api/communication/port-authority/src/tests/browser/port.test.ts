import { portSpec } from "../../specs/port";
import { forwardLifecycle } from "../_lifecycles";
import { browserLoopbackLifecycle } from "./_common";

describe("Browser", () => {
  describe("Loopback", () => {
    portSpec(browserLoopbackLifecycle);
  });

  describe("Forward", () => {
    portSpec(forwardLifecycle(browserLoopbackLifecycle, browserLoopbackLifecycle));
  });
});
