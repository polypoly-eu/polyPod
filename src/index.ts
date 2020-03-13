// @ts-ignore
import {default as UnTypeson} from "@polypoly-eu/typeson";
// @ts-ignore
import {default as unbuiltin} from "typeson-registry/presets/builtin";

export type Constructor<T> = Function & { prototype: T }

export type ManualHandler<T> = [
    (value: any) => boolean, // test function
    (value: T) => any,       // encapsulator function
    (value: any) => T        // reviver function
]

export type Handler<T> =
    Constructor<T> |
    ManualHandler<T>

export type Handlers = Record<string, Handler<any>> | Handlers[];

export interface Typeson {
    register(handlers: Handlers): this;
    encapsulate(value: any): any;
    revive(value: any): any;
}

interface TypesonConstructor {
    new(): Typeson;
}

export const builtin: Handlers = unbuiltin;

export const Typeson: TypesonConstructor = UnTypeson;

export function bubblewrap<T>(
    fqdn: string,
    ...constructors: Constructor<any>[]
): Handlers {
    const rec: Record<string, Constructor<any>> = {};
    for (const constructor of constructors)
        rec[fqdn + "." + constructor.prototype.constructor.name] = constructor;
    return rec;
}
