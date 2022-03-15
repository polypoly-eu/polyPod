import { dataFactory } from "../index";
import { DataFactorySpec } from "@polypoly-eu/rdf-spec";

describe("Spec", () => {
  new DataFactorySpec(dataFactory).run();
});
