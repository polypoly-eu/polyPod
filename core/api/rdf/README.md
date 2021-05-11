# rdf

![Node CI](https://github.com/polypoly-eu/rdf/workflows/Node%20CI/badge.svg)

TypeScript implementation of the RDF Data Model spec

## Overview

This repository provides a minimal implementation of the [RDFJS Data Model Spec](https://rdf.js.org/data-model-spec/).
It is tested against the [executable specification](https://github.com/polypoly-eu/rdf-spec).

The implementation is mostly a clone of the [reference implementation](https://github.com/rdfjs-base/data-model).
It improves upon this in two ways:

1. implemented in TypeScript and mechanically tested against the spec
2. resulting objects are instances of exported classes (see documentation for details)

## Example

```typescript
import {dataFactory} from "@polypoly-eu/rdf";

const subject = dataFactory.namedNode('http://example.org/subject');
const predicate = dataFactory.namedNode('http://example.org/predicate');
const object = dataFactory.namedNode('http://example.org/object');
const graph = dataFactory.namedNode('http://example.org/graph');
const quad = dataFactory.quad(subject, predicate, object, graph);
```
