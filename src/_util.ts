import { Decoder } from "io-ts/lib/Decoder";
import { pipe } from "fp-ts/lib/pipeable";
import { fold } from "fp-ts/lib/Either";
import * as Decode from "io-ts/lib/Decoder";

export function expect<I, A>(input: I, msg: string, decoder: Decoder<I, A>): A {
    return pipe(
        decoder.decode(input),
        fold(
            (error) => {
                throw new Error(msg + "\n" + Decode.draw(error));
            },
            (t) => t
        )
    );
}
