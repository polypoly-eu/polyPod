import { factories, convertSpec } from "./_util";

for (const [sourceName, sourceFactory] of Object.entries(factories))
  for (const [targetName, targetFactory] of Object.entries(factories))
    describe(`${sourceName} → ${targetName}`, () => {
      convertSpec(sourceFactory, targetFactory);
    });
