import {ConvertSpec} from "../convert";
import {factories} from "./_factories";

for (const [sourceName, sourceFactory] of Object.entries(factories))
    for (const [targetName, targetFactory] of Object.entries(factories))
        describe(`${sourceName} → ${targetName}`, () => {
            new ConvertSpec(sourceFactory, targetFactory).run();
        });
