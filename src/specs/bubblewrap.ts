import fc, {Arbitrary} from "fast-check";
import {Bubblewrap, Class, Classes} from "../index";

export type TypeInfo<T> = [Class<T>, Arbitrary<T>];

export type TypeInfos<T extends Record<string, unknown>> = {
    [P in keyof T]: TypeInfo<T[P]>
}

export class BubblewrapSpec<T extends Record<string, unknown>> {

    readonly bubblewrap: Bubblewrap;
    private readonly gen: Arbitrary<[Class<any>, unknown]>;

    constructor(
        private readonly infos: TypeInfos<T>
    ) {
        const gens: Arbitrary<[Class<any>, unknown]>[] = [];
        const constructors: Classes = {};

        for (const [key, [constructor, gen]] of Object.entries(this.infos)) {
            gens.push(gen.map((value: unknown) => [constructor, value]));
            constructors[key] = constructor;
        }

        this.bubblewrap = Bubblewrap.create(constructors);

        this.gen = fc.oneof(...gens);
    }

    run(): void {
        const {gen, bubblewrap} = this;

        it("decode/encode", () => {
            fc.assert(fc.property(gen, ([constructor, t]) => {
                const encoded = bubblewrap.encode(t);
                expect(encoded).toBeInstanceOf(Uint8Array);
                const decoded = bubblewrap.decode(encoded);
                expect(decoded).toEqual(t);
                expect(decoded).toBeInstanceOf(constructor);
            }));
        });
    }

}

