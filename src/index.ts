import {encode, decode, ExtensionCodec} from "@msgpack/msgpack";

export const deserialize: unique symbol = Symbol();
export const serialize: unique symbol = Symbol();

export interface MaybeSerializable {
    [serialize]?: () => any;
}

export interface Serializable extends MaybeSerializable {
    [serialize]: () => any;
}

function isSerializable(t: MaybeSerializable): t is Serializable {
    return t[serialize] !== undefined;
}

export type Class<T extends MaybeSerializable> = (new (...args: any[]) => T) & {
    prototype: T;
    [deserialize]?: (any: any) => T;
};

export type Classes = Record<string, Class<any>>;

export const msgPackEtypeUndef = 0x01;
export const msgPackEtypeClass = 0x02;
export const msgPackEtypeError = 0x03;

export class Undefined { }

export class Bubblewrap {
    codec?: ExtensionCodec;

    private constructor(
        private readonly classes: Classes
    ) {
    }

    static create(classes?: Classes): Bubblewrap {
        return new Bubblewrap(classes || {});
    }

    addHandlers(more: Classes): Bubblewrap {
        const thisKeys = Object.keys(this.classes);
        const thatKeys = Object.keys(more);
        for (const thisKey of thisKeys)
            if (thatKeys.includes(thisKey))
                throw new Error(`Duplicate key ${thisKey}`);
        return new Bubblewrap({ ...this.classes, ...more });
    }

    private makeCodec(): ExtensionCodec {
        const codec = new ExtensionCodec();

        codec.register({
            type: msgPackEtypeUndef,
            encode: value => value instanceof Undefined ? encode(null) : null,
            decode: () => undefined
        });

        codec.register({
            type: msgPackEtypeClass,
            encode: _value => {
                const entries = Object.entries(this.classes);
                // assume that later entries take precedence over earlier ones
                entries.reverse();
                for (const [name, Class] of entries) {
                    if (!(_value instanceof Class))
                        continue;

                    // @ts-ignore
                    const value: MaybeSerializable = _value;

                    if (isSerializable(value))
                        return encode([name, value[serialize]()], { extensionCodec: codec });

                    const raw = Object.entries(value);
                    const entries = raw.map(([key, value]) => {
                        if (value === undefined)
                            return [key, new Undefined()];
                        else
                            return [key, value];
                    });

                    return encode([name, entries], { extensionCodec: codec })
                }

                return null;
            },
            decode: buffer => {
                const [name, raw] = decode(buffer, { extensionCodec: codec }) as any;
                const Class = this.classes[name];

                const deserializer = Class[deserialize];
                if (deserializer !== undefined)
                    return deserializer(raw);

                // @ts-ignore
                const entries: [string, any][] = raw;

                return Object.assign(Object.create(Class.prototype), Object.fromEntries(entries));
            }
        });

        codec.register({
            type: msgPackEtypeError,
            encode: value => value instanceof Error ? encode(value.message) : null,
            decode: buffer => new Error(decode(buffer) as string)
        });

        return codec;
    }

    encode(value: any): Uint8Array {
        if (!this.codec)
            this.codec = this.makeCodec();

        return encode(value, { extensionCodec: this.codec });
    }

    decode(buffer: Uint8Array): any {
        if (!this.codec)
            this.codec = this.makeCodec();

        return decode(buffer, { extensionCodec: this.codec });
    }
}
