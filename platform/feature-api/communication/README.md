# Polypoly communication API

## bubblewrap

Lossless encoding and decoding of objects into byte arrays

### Overview

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
import { Bubblewrap } from "@polypoly-eu/communication";

class MyCoolClass {
    constructor(subject) {
        this.subject = subject;
    }

    greet() {
        console.log(`Hello ${this.subject}!`);
    }
}

const bubblewrap = Bubblewrap.create({
    MyCoolClass: MyCoolClass,
});

const encoded = bubblewrap.encode(new MyCoolClass("World"));

const decoded = bubblewrap.decode(encoded);

decoded.greet();
```

The decoded object is not the _same_ as the original object, but behaves equivalently.

## Limitations

-   The handling of `undefined` in the underlying MessagePack implementation is erratic.
    During encoding, `undefined` gets mapped to `null`, which – while rare – may be treated differently to `undefined` by library users.
    See the documentation for details.
-   `Error`s lose their stack trace and name by default.

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

## postoffice

RPC library for TypeScript

### Overview

This library allows transparent function calls on objects that may reside in a
different process. This works by capturing these calls, translating them into a
particular protocol, sending it over a wire, and finally executing it on the
other side. The response is sent back similarly. Encoding and error handling
is assumed to be dealt with by the transport layer, for example
[port-authority](../port-authority/).

We leverage TypeScript's type system to enable type-safe remote calls. Client
and server share a _specification_ of an API that can be called remotely.
Servers can implement this specification and have it listen on some port.
Clients can automatically obtain a callable object from the same specification.

### Example

The type specification for a simple API can be expressed using standard
TypeScript techniques:

```typescript
import { ObjectEndpointSpec, ValueEndpointSpec } from "@polypoly-eu/postoffice";

type SimpleEndpoint = ObjectEndpointSpec<{
    test1(param1: string): ValueEndpointSpec<number>;
    test2(param1: string): ValueEndpointSpec<number>;
    test3(parama: boolean, ...paramb: number[]): ValueEndpointSpec<string>;
}>;
```

By convention, these specifications are called “endpoints”.

Servers can implement this endpoint specification and may choose to use `async`
methods at any point. We assume port-authority as a transport layer.

```typescript
import {endpointServer, ServerOf} from "@polypoly-eu/postoffice";
import {server} from "@polypoly-eu/port-authority";

const simpleEndpointImpl: ServerOf<SimpleEndpoint> = {
    test1: async (param1: string) =>
        param1.length * 2,
    test2: (param1: string) =>
        param1.length * 2,
    test3: async (parama: boolean, ...paramb: number[]) =>
        throw new Error(`${parama}, ${paramb.join()}`)
};

server(serverPort, endpointServer(simpleEndpointImpl));
```

The implementation can be served on any port by leveraging the `port-authority`
module, including via HTTP or `MessagePort`s.

On the other side, clients can obtain a callable object:

```typescript
import { endpointClient, ClientOf } from "@polypoly-eu/postoffice";
import { client } from "@polypoly-eu/port-authority";

const rpcClient: ClientOf<SimpleEndpoint> = endpointClient(client(clientPort));

const numberResult: number = await rpcClient.test1("Hello")();

console.log(numberResult);
```

The callable object does not have exactly the same shape as the API
specification; function call chains need to be terminated by an empty function
call to “force” evaluation. Type inference and checking works as expected: the
argument and result types are checked like in regular function calls.

### Structure

This repository is structured as a TypeScript library with the following modules:

-   `types` contains the meta-specification types for endpoints
-   `protocol` defines the underlying protocol that are used for representing
    function calls and arguments
-   `rpc` converts specifications into clients and servers

### Security

This library performs no run-time checking of method names, parameter types or
method visibility. In particular, clients that use JavaScript or circumvent
type checking by other means may call methods that are present in the
implementation but not in the endpoint spec. General security best practices
apply: assume that any invocation of your server implementation is potentially
malevolent and treat client requests as untrusted.

A reasonable protection mechanism is to wrap the actual logic into an object
that performs validation using e.g. [io-ts](https://github.com/gcanti/io-ts).
Unfortunately, TypeScript's type system will not help when annotating the
parameters with the expected types. Instead, we recommend relaxing all types to
`unknown | undefined` and performing full manual validation:

```typescript
const simpleEndpointImpl: ServerOf<SimpleEndpoint> = {
    test1: async (param1?: unknown) => {
        // ...
        actualImpl.test1(/* ... */);
    },
    test2: (param1?: unknown) => {
        // ...
    },
    test3: async (parama?: unknown, ...paramb: unknown[]) => {
        // ...
    },
};
```
