# postoffice

![Node CI](https://github.com/polypoly-eu/postoffice/workflows/Node%20CI/badge.svg)

RPC library for TypeScript based on ports

## Overview

The [port-authority](https://github.com/polypoly-eu/port-authority/) provides port abstractions for typed bi-directional communication.
This library builds on top of these abstractions to provide transparent function calls on objects that may reside in a different process.
This works by capturing these calls, translating them into a particular protocol, sending it across the port, and finally executing it on the other side.
The response is sent back similarly.
As opposed to port-authority, this library is opinionated in that it suggests to use [bubblewrap](https://github.com/polypoly-eu/bubblewrap) for transport encoding (although it is not required).

We leverage TypeScript's type system to enable type-safe remote calls.
Client and server share a _specification_ of an API that can be called remotely.
Servers can implement this specification and have it listen on some port.
Clients can automatically obtain a callable object from the same specification.

## Example

The type specification for a simple API can be expressed using standard TypeScript techniques:

```typescript
import {ObjectEndpointSpec, ValueEndpointSpec} from "@polypoly-eu/postoffice";

type SimpleEndpoint = ObjectEndpointSpec<{
    test1(param1: string): ValueEndpointSpec<number>;
    test2(param1: string): ValueEndpointSpec<number>;
    test3(parama: boolean, ...paramb: number[]): ValueEndpointSpec<string>;
}>
```

By convention, these specifications are called “endpoints”.

Servers can implement this endpoint specification and may choose to use `async` methods at any point:

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

The implementation can be served on any port by leveraging the port-authority library, including via HTTP or `MessagePort`s.

On the other side, clients can obtain a callable object:

```typescript
import {endpointClient, ClientOf} from "@polypoly-eu/postoffice";
import {client} from "@polypoly-eu/port-authority";

const rpcClient: ClientOf<SimpleEndpoint> = endpointClient(client(clientPort));

const numberResult: number = await rpcClient.test1("Hello")();

console.log(numberResult);
```

The callable object does not have exactly the same shape as the API specification; function call chains need to be terminated by an empty function call to “force” evaluation.
Type inference and checking works as expected:
the argument and result types are checked like in regular function calls.

## Structure

This repository is structured as a TypeScript library with the following modules:

* `types` contains the meta-specification types for endpoints
* `protocol` defines classes and Bubblewrap configuration for the remote protocol
* `rpc` converts specifications into clients and servers

## Security

This library performs no run-time checking of method names, parameter types or method visibility.
In particular, clients that use JavaScript or circumvent type checking by other means may call methods that are present in the implementation but not in the endpoint spec.
General security best practices apply:
assume that any invocation of your server implementation is potentially malevolent and treat client requests as untrusted.

A reasonable protection mechanism is to wrap the actual logic into an object that performs validation using e.g. [io-ts](https://github.com/gcanti/io-ts).
Unfortunately, TypeScript's type system will not help when annotating the parameters with the expected types.
Instead, we recommend relaxing all types to `unknown | undefined` and performing full manual validation:

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
    }
};
```
