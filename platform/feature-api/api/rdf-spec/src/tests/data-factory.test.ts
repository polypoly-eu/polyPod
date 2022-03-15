import { DataFactorySpec } from "../data-factory";
import { factories } from "./_factories";

for (const [name, factory] of Object.entries(factories))
  describe(name, () => {
    new DataFactorySpec(factory).run();
  });
