# polyPod API

This package contains all the types and documentation for the API exposed to
Features. Features written in TypeScript can make use of the included type
definitions - for Features written in JavaScript, this package doesn't provide
any benefit beyond the source code documentation.

As far as reasonably possible, the API tries to stick to existing interfaces,
for example [RDFJS](http://rdf.js.org) for interfacing with the triplestore.

Since Features run in a heavily sandboxed environment, there are a variety of
APIs for things that normal web apps can use browser APIs for, such as `Fetch`
for making arbitrary, barely restricted HTTP requests - which the polyPod
prohibits.

The `Pod` interface specifies the `window.pod` object available to Features.
