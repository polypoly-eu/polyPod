export interface Success<T> {
    tag: "success";
    value: T;
}

export interface Failure {
    tag: "failure";
    err: unknown;
}

export type Try<T> = Success<T> | Failure;

export async function recoverPromise<T>(p: Promise<T>): Promise<Try<T>> {
    try {
        return {
            tag: "success",
            value: await p
        };
    }
    catch (err) {
        return {
            tag: "failure",
            err
        };
    }
}
