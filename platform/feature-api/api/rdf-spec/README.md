# rdf-spec

Standalone executable spec for RDFJS

## Overview

The [RDFJS](http://rdf.js.org/) group defines three standards for JavaScript
libraries that manipulate RDF entities.  The following table gives an overview
over these standards and whether they are implemented in this library.

| Standard        | Purpose            | Specification                          | Reference implementation       | Status     |
|-----------------|--------------------|----------------------------------------|--------------------------------|------------|
| Data Factory    | terms and quads    | http://rdf.js.org/data-model-spec/     | [@rdfjs/data-model](https://github.com/rdfjs-base/data-model) | Implemented |
| Dataset         | sets of quads (_graphs_) | https://rdf.js.org/dataset-spec/ | [@rdfjs/dataset](https://github.com/rdfjs-base/dataset)       | Partially implemented (only `DatasetCore`) |
| Streams         | stream processing of quads | http://rdf.js.org/stream-spec/ | (none)                         | Not implemented |
| (Types)         | TypeScript definitions | | [@types/rdf-js](https://www.npmjs.com/package/@types/rdf-js)      | Used |

The purpose of this repository is to provide executable specifications modelled
after the textual specifications.  To that extent, we have repackaged the tests
of the reference implementations.  Additionally, we provide
[fast-check](https://github.com/dubzzz/fast-check/) generators for RDF terms and
quads that can be used outside the spec context.

Besides the mere test cases for the specification, this library also runs them
against existing implementations.  Currently, the following libraries are
covered:

* the reference implementations according to the table above
* [graphy.js](https://graphy.link/), with these caveats:
  * `memory.dataset.fast` only works with quads from the `core.data.factory`
    factory, not with other quads
  * `memory.dataset.fast` does not implement the `DatasetCoreFactory` interface
    (see test for details)
  * `core.data.factory` only supports RDF.js up to version 3 (pending support
    for version 4)
* [rdf-data-factory](https://www.npmjs.com/package/rdf-data-factory) (only data
  factory)
* [N3.js](https://github.com/rdfjs/N3.js) (only data factory)

The following implementations are not spec-compliant:

* [rdflib](https://github.com/linkeddata/rdflib.js)

## Example

Assuming you want to test that the reference data factory implementation
conforms to the specification, you can add this to your tests:

```typescript
import {DataFactorySpec} from "@polypoly-eu/rdf-spec";
import RDFJS from "@rdfjs/data-model";

describe("@rdfjs/data-model", () => {
    new DataFactorySpec(RDFJS).run();
});
```

This will execute a set of test cases using the provided factory.

The tests are written in a style that allows them to be run under multiple test
frameworks.  We provides you a choice between (currently) Jest, Jasmine, or
Mocha for your own tests.  Please see the module documentation for more details.

## Limitations

* The spec coverage could always be improved.
* More implementations of the RDFJS specification could be tested.
