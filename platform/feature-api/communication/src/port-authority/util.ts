/**
 * Utilities for error handling.
 *
 * @packageDocumentation
 */

/**
 * An interface representing a successful computation.
 * @interface Success
 */
export interface Success<T> {
    value: T;
}

/**
 * An interface representing a failed computation.
 * @interface Failure
 */
export interface Failure {
    err: unknown;
}

/**
 * A union type representing a successful or failed computation.
 *
 * This type can be imagined to be equivalent to a `Promise` that has been resolved or rejected, i.e., where the
 * resulting state is known and not pending.
 * @alias Try
 */
export type Try<T> = Success<T> | Failure;

/**
 * Transforms a [[Try]] into a promise that is resolved or rejected depending on [[Success]] or [[Failure]] state.
 *
 * See [[triedPromise]] for the inverse operation.
 * @param {Try<T>} t - [[Try]] to be transformed
 */
export async function rethrowPromise<T>(t: Try<T>): Promise<T> {
    if ("value" in t) return t.value;
    else throw t.err;
}

/**
 * Transforms a promise into a promise that is guaranteed not to be rejected. If the underlying promise is rejected,
 * the returned promise is resolved with a `Failure` containing the error.
 *
 * See [[rethrowPromise]] for the inverse operation.
 * @param {Promise<T>} p - promise to be transformed
 */
export async function triedPromise<T>(p: Promise<T>): Promise<Try<T>> {
    try {
        return {
            value: await p,
        };
    } catch (err) {
        return {
            err,
        };
    }
}

/** @ignore */
export interface Resource<T> {
    value: T;
    cleanup?: () => Promise<void>;
}

/** @ignore */
export function mapResource<T, U>(
    resource: Resource<T>,
    f: (t: T) => U
): Resource<U> {
    return {
        value: f(resource.value),
        cleanup: async () => {
            if (resource.cleanup) await resource.cleanup();
        },
    };
}
