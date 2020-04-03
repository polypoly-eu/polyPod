# poly-api

![Node CI](https://github.com/polypoly-eu/poly-api/workflows/Node%20CI/badge.svg)

Definition, spec, and default implementation of the Pod API

## Overview

This repository defines the interfaces that the Pod and the Features use to communicate with each other.
There are two sides: the Pod needs to bootstrap and initialize the Feature, and the Feature needs to request data from or store data in the Pod.
As far as possible, we try to stick to standardized APIs, for example [RDFJS](http://rdf.js.org/).

Additionally, Features may expect access to the browser DOM via standard means (e.g. the `document` global variable).
DOM access is an implementation detail of the runtime that Pods provide to the Feature.
It is – along with the packaging requirements for Features – only specified textually in this repository.

While Features are implemented in JavaScript, the Pod itself can be implemented in any language that is capable of executing JavaScript code in some kind of sandbox.
The sandbox is necessary to prevent Features from accessing arbitrary other APIs, e.g. writing cookies, or interfering with other Features.
In a browser-based Pod implementation, this can be achieved by confining Features to an `iframe`.

Pod implementations are free to bootstrap Features and provide them with the Pod interfaces in any way they see fit.
This may also depend on the host language:
Some host languages can pass host objects implementing the API directly to the JavaScript runtime, while others need to provide a messaging layer.
It is also possible to implement the API remotely via HTTP.
This specification makes no assumptions about the underlying communication layer between Pod and Feature.

## Example

The following example shows an example feature that exercises a few different interfaces.
First, it creates an RDF triple and adds it to the Pod's store.
Secondly, it queries the Pod for all stored triples and renders them as an HTML list to the DOM; specifically to the DOM node with the id `feature`.

```javascript
export default class ExampleFeature {
    async init(pod) {
        const {polyIn} = pod;
        const quad = polyIn.factory.triple(
            polyIn.factory.namedNode("http://example.org/s"),
            polyIn.factory.namedNode("http://example.org/p"),
            polyIn.factory.namedNode("http://example.org/o")
        );
        await pod.polyIn.add(quad);
        const selected = await pod.polyIn.select({});
        const ul = document.createElement("ul");
        const root = document.getElementById("feature");
        root.innerHTML = "";
        root.appendChild(ul);
        for (const quad of selected) {
            console.dir(quad);
            const li = document.createElement("li");
            ul.appendChild(li);
            li.appendChild(document.createTextNode(JSON.stringify(quad)));
        }
    }
}
```

## Structure

This repository is structured as a TypeScript library with the following modules:

* `api` contains type definitions, describing the shape of the interfaces
* `default` provides a minimal reference implementation (excluding the DOM interface)
* `specs/api` is a conformance test for API implementations (excluding the DOM interface)

The `index` package is an entrypoint re-exporting everything from these modules.