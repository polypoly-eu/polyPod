# port-authority

A typed view on communication through ports

## Overview

With the [Channel Messaging API](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API), browsers offer (untyped) communication channels between separate logical processes.
Prime examples are iframes and web workers.
The basic idea is that a `MessageChannel` comprises two bi-directional _ports_:
messages sent into one port can be observed in the other, and vice versa.

Node.js' built-in [Worker Threads](https://nodejs.org/api/worker_threads.html) module provides a similar API that differs in some important aspects.
Whereas messages in the browser are wrapped in a special DOM event, Node.js sends objects "as-is".
Additionally, registering listeners works differently.

This library provides a total of three abstraction layers:

1. The basic layer is a universal, platform-independent abstraction called `Port` (or “raw port”).
   A raw port is defined by the (typed) send operation and the possibility to register (typed) listeners.
   Communication on ports is unstructured, that is, there is no client-server or request-response semantics.
   Both Node.js and browser messaging APIs can be subsumed with this abstraction, although their types differ slightly.
2. The intermediate layer includes potentially-failing asynchronous request-response ports, both for clients (`RequestPort`) and servers (`ResponsePort`).
   Raw ports can be lifted to this abstraction by adding a thin protocol identifying requests with an increasing counter.
3. The final, user-level layer is a mere function `Request => Promise<Response>` that hides away the underlying `Port` machinery.
   Developers that want to implement a server can define such a function and use it to uniformly listen on any supported port.
   On the other hand, developers that need a client can turn any supported port into a function that transparently handles the communication.

Interoperability with [Bubblewrap](../bubblewrap) is provided so that arbitrary objects can be sent over the wire.

## Example

```javascript
import { MessageChannel } from "worker_threads";
import { fromNodeMessagePort } from "@polypoly-eu/port-authority";

const channel = new MessageChannel();

const port1 = fromNodeMessagePort(channel.port1);
const port2 = fromNodeMessagePort(channel.port2);

port2.addHandler(console.dir);

port1.send("Hello world");
```

## Structure

This module is structured as a TypeScript library with the following modules:

-   `port` contains the universal port abstraction
-   `procedure` contains the universal request-response abstractions
-   `browser` provides browser-specific code
-   `node` provides Node-specific code (code-split into a separate import)
-   `middleware` provides a few functions that bridge different ports


## Limitations

The behaviour of ports when multiple handlers are added is non-uniform depending on the use case.
Ports may be changed in the future to only support one active handler.
