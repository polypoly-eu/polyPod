# bubblewrap

Lossless encoding and decoding of objects into byte arrays

## Overview

When transferring JavaScript objects over channels, they usually need to be serialized into a transfer format.
A widespread transfer format is JSON: with `JSON.stringify`, objects can be converted to strings by the sender.
The recipient can reconstruct the object using `JSON.parse`.
However, this decoding and encoding is not _transparent_, i.e., objects behave differently after they have been transferred.
This makes sense because JSON cannot represent the entire JavaScript semantics, e.g. prototypes of objects.

Similarly, this problem affects seemingly "smart" channels such as `MessageChannel`.
Using `postMessage` across `<iframe>`s, `MessageChannel`s or others subject data to the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).

In summary, common data transfer techniques are lossy.

In many situations, this is not acceptable and there is a need for lossless data transfer.
Specifically, decoded objects should _behave_ similarly to the original objects.

This library solves this problem in two parts:

1. We standardize on [MessagePack](https://msgpack.org/) as transport format.
2. We leverage the [JavaScript reference implementation](https://www.npmjs.com/package/@msgpack/msgpack) to register hooks, allowing us finer-grained control over decoding and encoding of objects.

## Example

We can declare a class with a constructor and some methods.
By default, Bubblewrap doesn't know anything about classes, so when creating the encoder/decoder, we need to pass a dictionary of known classes.

```javascript
import {Bubblewrap} from "@polypoly-eu/bubblewrap";

class MyCoolClass {
    constructor(subject) {
        this.subject = subject;
    }

    greet() {
        console.log(`Hello ${this.subject}!`);
    }
}

const bubblewrap = Bubblewrap.create({
    "MyCoolClass": MyCoolClass
});

const encoded = bubblewrap.encode(new MyCoolClass("World"));

const decoded = bubblewrap.decode(encoded);

decoded.greet();
```

The decoded object is not the _same_ as the original object, but behaves equivalently.

## Limitations

* The handling of `undefined` in the underlying MessagePack implementation is erratic.
  During encoding, `undefined` gets mapped to `null`, which – while rare – may be treated differently to `undefined` by library users.
  See the documentation for details.
* `Error`s lose their stack trace and name by default.

## Benchmarks

Dataset source: [British Geological Survey](http://data.bgs.ac.uk/downloads/data_bgs_ac_uk_ALL.zip), file `EarthMaterialClass_RockComponent.nt`

```
./src/main/javascript/benchmarks/rdf.bench.ts
Measuring 13910 quads
encoding x 1.31 ops/sec ±2.66% (8 runs sampled)
encoding (strict) x 1.29 ops/sec ±1.28% (8 runs sampled)
encoding (raw) x 15.18 ops/sec ±1.94% (35 runs sampled)
decoding x 4.36 ops/sec ±1.85% (15 runs sampled)
decoding (strict) x 4.39 ops/sec ±4.41% (16 runs sampled)
decoding (raw) x 12.50 ops/sec ±1.82% (35 runs sampled)
decoding (raw-then-convert) x 11.30 ops/sec ±5.96% (33 runs sampled)
roundtrip x 0.93 ops/sec ±3.15% (7 runs sampled)
roundtrip (strict) x 0.91 ops/sec ±2.69% (7 runs sampled)
roundtrip (raw-then-convert) x 6.53 ops/sec ±4.95% (21 runs sampled)
```
