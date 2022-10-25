# polyPod Features

These are various Features that can run in the polyPod. Some are bundled with it
and part of its core functionality, others are just for testing or documentation
purposes.

## Creating a new Feature

To get started, you can simply use [poly-cli](../dev-utils/poly-cli) to generate
a new Feature, then you can build it and open its `dist/index.html` file in a
browser.

Under the hood, this is using [pod.js](../platform/podjs), which is the most
common environment to use for Feature development, since it's fast and gives you
access to all the usual tools for web development.

## Bundling a Feature

At the moment, no platform supports Feature installation. So the only way to run
a Feature in an environment other than pod.js, is to add it to the
[bundle](bundle).
