# polyLook

polyLook is a visual component library for polyPod Features.

While it can easily be used in regular web applications (just as
regular web component frameworks can be used in polyPod Features)
polyLook primarily contains components that are specifically useful
for Features - as well as a look and feel that suits the polyPod.

polyLook aims to be framework agnostic. However, at the moment, it
mainly contains [React](https://reactjs.org) components. There are a
few experimental components based on [LitElement](https://lit.dev),
which would be framework agnostic.

To see the components in action, have a look at the
[preview](https://polypoly-eu.github.io/polyPod/feature-utils/poly-look-preview).

## Building

First, follow the instructions in [the top-level
README](../../README.md). Then, you can rebuild polyLook after making
changes by running:

    npm run build

Please note that if you want to test changes in a Feature, you will
also have to rebuild that one. To automatically rebuild polyLook and
all packages (mainly Features) depending on it, run:

    npm run build-downstream

## Testing

You will find some unit tests in [test](test), to run them:

    npm test

In order to test components visually (yet manually), see
[storybook](storybook).

## Structure

The React components are located in [src/react-components](src/react-components).

Framework agnostic visualisations are in
[src/visualisations](src/visualisations), with wrappers (mainly for
React) in [src/visualisations/wrappers](src/visualisations/wrappers).

The experimental LitElement components are in
[src/lit-components](src/lit-components).
