import { eliminate, intercept, nullInterceptor, AsyncOperation } from "../index";
import { foobar, Foobar } from "./_common";
import { expectTypeOf } from "expect-type";

describe("AOP", () => {
    it("No behaviour change", async () => {
        const wrapped = intercept<Foobar>(foobar, nullInterceptor);
        expectTypeOf(wrapped).toMatchTypeOf<Foobar>();

        expectTypeOf(wrapped.f(1)).toMatchTypeOf<Promise<string>>();
        await expect(wrapped.f(1)).resolves.toEqual("1");

        expectTypeOf(wrapped.g(1, "2")).toMatchTypeOf<Promise<number>>();
        await expect(wrapped.g(1, "2")).resolves.toEqual(2);

        expectTypeOf(wrapped.h("1", 2, 3)).toMatchTypeOf<Promise<void>>();
        await expect(wrapped.h("1", 2, 3)).resolves.toBe(undefined);
    });

    it("Call rejection", async () => {
        const wrapped = intercept<Foobar>(foobar, {
            async guard<Name extends keyof Foobar>(operation: AsyncOperation<Foobar, Name>) {
                return eliminate(operation, {
                    f: () => {
                        throw new Error("rejected");
                    },
                    g: () => undefined,
                    h: (self, param, ...rest) => {
                        expectTypeOf(self).toMatchTypeOf<Foobar>();
                        expectTypeOf(param).toBeString();
                        expectTypeOf(rest).toMatchTypeOf<number[]>();
                        if (rest.length === 1) return undefined;
                        throw new Error("rejected");
                    },
                });
            },
        });

        await expect(wrapped.f(1)).rejects.toThrowError("rejected");
        await expect(wrapped.g(1, "2")).resolves.toEqual(2);
        await expect(wrapped.h("1", 2, 3)).rejects.toThrowError("rejected");
        await expect(wrapped.h("1", 2)).resolves.toBe(undefined);
    });

    it("Call filtering", async () => {
        const wrapped = intercept<Foobar>(foobar, {
            async guard<Name extends keyof Foobar>(operation: AsyncOperation<Foobar, Name>) {
                return eliminate(operation, {
                    f: () => async (str) => {
                        expectTypeOf(str).toBeString();
                        return str + str;
                    },
                    g: () => async (num) => {
                        expectTypeOf(num).toBeNumber();
                        return num * 3;
                    },
                    h: () => undefined,
                });
            },
        });

        await expect(wrapped.f(1)).resolves.toEqual("11");
        await expect(wrapped.g(1, "2")).resolves.toEqual(6);
    });
});
