# rdf-spec

![Node CI](https://github.com/polypoly-eu/rdf-spec/workflows/Node%20CI/badge.svg)

Standalone executable spec for RDFJS

## Overview

The [RDFJS](http://rdf.js.org/) group defines three standards for JavaScript libraries that manipulate RDF entities.
The following table gives an overview over these standards and whether they are implemented in this library.

| Standard        | Purpose            | Specification                          | Reference implementation       | Status     |
|-----------------|--------------------|----------------------------------------|--------------------------------|------------|
| Data Factory    | terms and quads    | http://rdf.js.org/data-model-spec/     | [@rdfjs/data-model](https://github.com/rdfjs-base/data-model) | Implemented |
| Dataset         | sets of quads (_graphs_) | https://rdf.js.org/dataset-spec/ | [@rdfjs/dataset](https://github.com/rdfjs-base/dataset)       | Partially implemented (only `DatasetCore`) |
| Streams         | stream processing of quads | http://rdf.js.org/stream-spec/ | (none)                         | Not implemented |
| (Types)         | TypeScript definitions | | [@types/rdf-js](https://www.npmjs.com/package/@types/rdf-js)      | Used |

The purpose of this repository is to provide executable specifications modelled after the textual specifications.
To that extent, we have repackaged the tests of the reference implementations.
Additionally, we provide [fast-check](https://github.com/dubzzz/fast-check/) generators for RDF terms and quads that can be used outside the spec context.

Besides the mere test cases for the specification, this library also runs them against existing implementations.
Currently, the following libraries are covered:

* the reference implementations according to the table above
* [@graphy/core.data.factory](https://graphy.link/core.data.factory)

## Example

Assuming you want to test that the reference data factory implementation conforms to the specification, you can add this to your tests:

```typescript
import {DataFactorySpec} from "@polypoly-eu/rdf-spec";
import RDFJS from "@rdfjs/data-model";

describe("@rdfjs/data-model", () => {
    new DataFactorySpec(RDFJS).run();
});
```

This will execute a set of test cases using the provided factory.

## Limitations

* The spec coverage could always be improved.
* More implementations of the RDFJS specification could be tested.