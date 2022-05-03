import { dataFactory } from "../index";
import { DataFactorySpec } from "@polypoly-eu/api";

describe("Spec", () => {
    new DataFactorySpec(dataFactory).run();
});
