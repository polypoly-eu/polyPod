import { browserLoopbackLifecycle } from "./_common";
import { procedureSpec } from "../../specs/procedure";
import { procedureLiftedLifecycle } from "../_lifecycles";

describe("Browser/Procedure", () => {
    describe("lifted", () => {
        procedureSpec(procedureLiftedLifecycle(browserLoopbackLifecycle));
    });
});
