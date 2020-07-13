# poly-api

![Node CI](https://github.com/polypoly-eu/poly-api/workflows/Node%20CI/badge.svg)

Definition, spec, and default implementation of the Pod API

## Overview

This repository defines the interfaces that the Pod and the Features use to communicate with each other.
There are two sides: the Pod needs to bootstrap and initialize the Feature, and the Feature needs to request data from or store data in the Pod.
As far as possible, we try to stick to standardized APIs, for example [RDFJS](http://rdf.js.org/).

Features are vanilla web applications, that is, they comprise an HTML document that may reference scripts and other types of assets such as stylesheets and images.
The JavaScript code may access to the browser DOM via standard means (e.g. the `document` global variable).
In other words, the Feature may assume it is running within a standard browser.

To constrain Features, Pod implementations may choose to run them inside a sandboxed `iframe`.
This implies that Features cannot assume access to arbitrary other APIs, e.g. writing cookies, or interfering with other Features.

Pod implementations are free to bootstrap Features and provide them with the Pod interfaces in any way they see fit.
This may also depend on the host platform:
Some host languages can pass host objects implementing the API directly to the JavaScript runtime, while others need to provide a messaging layer.
It is also possible to implement the API remotely via HTTP.
This specification makes no assumptions about the underlying communication layer between Pod and Feature.

## Example

The following example shows an example feature that exercises a few different interfaces.
First, it creates an RDF triple and adds it to the Pod's store.
Secondly, it queries the Pod for all stored triples and renders them as an HTML list to the DOM; specifically to the DOM node with the id `feature`.

```html
<!DOCTYPE HTML>
<html>
    <body>
        <div class="feature"></div>

        <script>
            window.addEventListener("podReady", async () => {
                // API is also attached to the event
                const {dataFactory} = window.pod;
                const quad = dataFactory.quad(
                    dataFactory.namedNode("http://example.org/s"),
                    dataFactory.namedNode("http://example.org/p"),
                    dataFactory.namedNode("http://example.org/o")
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
            });
        </script>
    </body>
</html>
```

## Structure

This repository is structured as a TypeScript library with the following modules:

* `api` contains type definitions, describing the shape of the interfaces
    * `fs` defines the filesystem operations
    * `fetch` defines the [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)-compatible API for HTTP requests
* `feature` contains additional type definitions for the DOM that Features can expect
* `default` provides a minimal reference implementation (excluding the DOM interface)
* `specs/api` is a conformance test for API implementations (excluding the DOM interface)

The `index` package is an entrypoint re-exporting everything from these modules.