# polyPod API

Specs for the low-level polyPod API, as well as all stuff related to dealing
with RDF triples.

The descriptions below are old and refer to distinct packages that have since
been merged and simplified.

## pod-api

Definition, spec, and default implementation of the polyPod API

### Overview

This repository defines the interface between the polyPod and Features. As far
as reasonably possible, we try to stick to existing APIs, for example
[RDFJS](http://rdf.js.org/) for querying and storing data.

Features run in a sandboxed browsing context, which means they have access to a
lot of the usual browser APIs, but things such as data storage and external
communication need to go through the polyPod API, i.e. an implementation of the
`Pod` interface as specified here. The concrete polyPod implementations, such as the
polyPod for Android, expose objects that implement the `Pod` interface to
the Feature.

### Structure

This repository is structured as a TypeScript library with the following
modules:

-   `api` contains type definitions, describing the shape of the interfaces
    -   `fs` defines the filesystem operations
    -   `fetch` defines the [Fetch]-compatible API for sending HTTP(S) requests
-   `feature` contains additional type definitions for the DOM that Features can
    expect
-   `fs` provides a minimal filesystem interface that works across JS implementations.
-   `default` provides a minimal reference implementation (excluding the DOM
    interface)
-   `spec` is a conformance test for API implementations (excluding the DOM
    interface)

[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API


## rdf

TypeScript implementation of the RDF Data Model spec

### Overview

This repository provides a minimal implementation of the [RDFJS Data Model Spec]
that is tested against the [executable specification].

It is mostly a clone of the [reference implementation], improving upon it in two
ways:

1. implemented in TypeScript and mechanically tested against the spec
2. the resulting objects are instances of exported classes (see documentation
   for details)

### Example

```typescript
import {dataFactory} from "@polypoly-eu/rdf";

const subject = dataFactory.namedNode('http://example.org/subject');
const predicate = dataFactory.namedNode('http://example.org/predicate');
const object = dataFactory.namedNode('http://example.org/object');
const graph = dataFactory.namedNode('http://example.org/graph');
const quad = dataFactory.quad(subject, predicate, object, graph);
```

[executable specification]: ../rdf-spec
[RDFJS Data Model Spec]: https://rdf.js.org/data-model-spec/
[reference implementation]: https://github.com/rdfjs-base/data-model
