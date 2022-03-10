# pod.js

A polyPod implementation that runs in a regular web browser.

## Reasoning

The polyPod uses a lot of web technologies under the hood, and modern
browsers ship with very powerful development tools, which makes web
browsers the ideal environment for developing polyPod features.

As for production use: A lot of features don't make sense in
isolation, yet those that do can be easily deployed on a HTTP server
by using `pod.js`.

# manifest-parser

Reference implementation of the Feature manifest format

## Limitations

Currently, any feature including `pod.js` will become a fully
functional polyPod, except for one thing: It only runs a single
feature. While we could support the creation of a container and a
mechanism for loading features in `pod.js` without too much trouble,
it is currently not implemented.

The `polyOut` and `polyNav` interfaces are not implemented at the
moment. The former because we don't use it yet, the latter because it
is currently not part of the `Pod` interface, which we aim to rectify
soon.

## Building

Simply run `build.js` in the repository root.

## Usage

You will need to use this module for creating a polyPod-compatible
feature. Follow these instructions:

1. Add _podjs_ as a development dependency to your feature.
2. Copy or link `node_modules/@polypoly-eu/podjs/dist/pod.js`.
3. Include `pod.js` from your feature's main document - before the
   feature's own code.
