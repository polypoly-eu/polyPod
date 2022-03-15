import { loopbackLifecycle, procedureLiftedLifecycle } from "../_lifecycles";
import { procedureSpec } from "../../specs/procedure";

describe("Universal/Procedure", () => {
  describe("lift", () => {
    procedureSpec(procedureLiftedLifecycle(loopbackLifecycle));
  });
});
