/**
 * Utilities for error handling.
 *
 * @packageDocumentation
 */

/**
 * An interface representing a successful computation.
 */
export interface Success<T> {
  tag: "success";
  value: T;
}

/**
 * An interface representing a failed computation.
 */
export interface Failure {
  tag: "failure";
  err: unknown;
}

/**
 * A union type representing a successful or failed computation.
 *
 * This type can be imagined to be equivalent to a `Promise` that has been resolved or rejected, i.e., where the
 * resulting state is known and not pending.
 */
export type Try<T> = Success<T> | Failure;

/**
 * Transforms a [[Try]] into a promise that is resolved or rejected depending on [[Success]] or [[Failure]] state.
 *
 * See [[recoverPromise]] for the inverse operation.
 */
export async function rethrowPromise<T>(t: Try<T>): Promise<T> {
  if (t.tag === "success") return t.value;
  else throw t.err;
}

/**
 * Transforms a promise into a promise that is guaranteed not to be rejected. If the underlying promise is rejected,
 * the returned promise is resolved with a `Failure` containing the error.
 *
 * See [[rethrowPromise]] for the inverse operation.
 */
export async function recoverPromise<T>(p: Promise<T>): Promise<Try<T>> {
  try {
    return {
      tag: "success",
      value: await p,
    };
  } catch (err) {
    return {
      tag: "failure",
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
export function mapResource<T, U>(resource: Resource<T>, f: (t: T) => U): Resource<U> {
  return {
    value: f(resource.value),
    cleanup: async () => {
      if (resource.cleanup) await resource.cleanup();
    },
  };
}
