# polyPod communication

This package contains a client for client/server polyPod
implementations. Features don't need to actively use this package, it gets
delivered to the Feature by the respective polyPod implementation under the name
`pod.js`.

Under the hood, this package is using four separate modules, that are - at the
time of writing - mildly overengineered as they were intended as independently
useful libraries:

## [remote-pod](src/remote-pod)

The actual client implementation of the `Pod` interface, as defined in [the
api](../api). This package produces `bootstrap.js`, which polyPod
implementations using the client/server mechanism deliver to Features as
`pod.js`.

## [bubblewrap](src/bubblewrap)

A library that handles encoding and decoding of objects as byte arrays.

When transferring JavaScript objects over channels, they usually need to be
serialized into a transfer format. A widespread transfer format is JSON, which
is however not lossless - JSON cannot represent the entire semantics of
JavaScript objects, e.g. prototypes.

This library solves this problem in two parts:

1. We standardize on [MessagePack](https://msgpack.org/) as transport format.
2. We leverage the [JavaScript reference
   implementation](https://www.npmjs.com/package/@msgpack/msgpack) to register
   hooks, allowing us finer-grained control over decoding and encoding of
   objects.

## [postoffice](src/postoffice)

An RPC library for TypeScript.

It allows transparent function calls on objects that reside in a different
process. This works by capturing these calls, translating them into a common
protocol, sending them over the communication channel, and finally executing
them on the other side. The response is sent back in a similar way. Encoding and
error handling is assumed to be dealt with by the transport layer,
i.e. _port-authority_.

When both client and server are implemented in TypeScript, the communication is
type-safe, because they can share the same specification (i.e. _endpoints_).

## [port-authority](src/port-authority)

A messaging library for the browser and Node.js.

With the [Channel Messaging
API](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API),
browsers offer communication channels between different (logical) processes, or
browsing contexts - such as iframes and web workers. The basic idea is that a
`MessageChannel` comprises of two bi-directional _ports_: Messages sent into one
port can be received in the other, and vice versa.

Node.js' built-in [Worker Threads](https://nodejs.org/api/worker_threads.html)
module provides a similar API that differs in some aspects, for example: Whereas
messages in the browser are wrapped in a special DOM event, Node.js sends
objects "as-is".

This library provides a platform independent abstraction that works with both
Node.js' and browsers' messaging APIs, and supports _bubblewrap_ for the
payloads.
