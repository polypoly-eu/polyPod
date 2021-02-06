import { podSpec } from "@polypoly-eu/poly-api/dist/spec";
import { getHttpbinUrl } from "@polypoly-eu/fetch-spec";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { browserPod } from "../../browser";

chai.use(chaiAsPromised);

describe("Browser pod", () => {
    podSpec(browserPod(), "/", getHttpbinUrl());
});
