import {assert} from "chai";
import fc, {Arbitrary, IAsyncProperty} from "fast-check";
import {recoverPromise} from "../util";

export interface Resource<T> {
    value: T;
    cleanup?: () => Promise<void>;
}

export function mapResource<T, U>(resource: Resource<T>, f: (t: T) => U): Resource<U> {
    return {
        value: f(resource.value),
        cleanup: async () => {
            if (resource.cleanup)
                await resource.cleanup();
        }
    };
}

export function probeFunctionEquality<T, U>(
    f1: (t: T) => Promise<U>,
    f2: (t: T) => Promise<U>,
    gen: Arbitrary<T>
): IAsyncProperty<[T]> {
    return fc.asyncProperty(gen, async t => {
        assert.deepEqual(await recoverPromise(f1(t)), await recoverPromise(f2(t)));
    });
}

export interface Mock<Ts extends unknown[], U> {
    (...t: Ts): U;
    calls: Ts[];
}

export function mock<Ts extends unknown[], U>(f: (...t: Ts) => U): Mock<Ts, U> {
    const calls: Ts[] = [];
    const fn: (...t: Ts) => U = (...t) => {
        calls.push(t);
        return f(...t);
    };

    return Object.assign(fn, { calls });
}
