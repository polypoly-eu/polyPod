# polyPod

The polyPod

At the moment, the polyPod is essentially a runtime for _features_; small,
sandboxed JavaScript applications that can be launched from the polyPod app.

But it will be much more than that, for more information read [the polyPod
whitepaper].

## Please note

The code in this repository used to be spread across more than a dozen
individual repositories. While it generally works, there are still a few things
we need to fix, including adjusting the overall structure and documentation.

## Components

### polyPod app for Android

You can find the Android version of the polyPod in
[polyPod-Android](polyPod-Android).

### Features

This repository contains various features we use for documentation and testing
purposes, as well as features that get bundled with the polyPod itself:

- [polyExplorer-feature](polyHello-feature) is still under active development,
  but will be the one feature bundled with the initial polyPod release.
- [orodruin/example](orodruin/example) is an example feature that uses some
  polyPod APIs.
- [testFeature](testFeature) is a feature polyPod implementations can write
  tests against, to verify it all works properly end to end.

### The shared polyPod core code

All the other packages contain the internal workings of the polyPod, such as the
feature runtime execution environment. Refer to the individual packages to learn
more about what they are for, but note that we aim to improve the structure,
naming and documentation to make things more understandable.

## Requirements

Just [Node.js](https://nodejs.org/) version 15.x.

## Building

Just execute:

    $ ./build.js

After this you can build [polyPod-Android](polyPod-Android), or
[orodruin/example](orodruin/example).

### Wat

Yes, we have a nasty custom build script.

The initial polyPod code base was composed of various small modules that used to
live in different repositories, including each other via package registries. We
migrated all of these packages into a single repository (the kids call it
_monorepo_), to make the code base easier to work with.

We experimented with Yarn and pnpm workspaces to eliminate some of the logic of
`build.js`, and with a few workarounds we can make it work. But for now, we
decided to stick to NPM and a short build script to make it all work together.
NPM is probably not the best package manager for Node.js, but it is the most
widely understood and supported one.

## Testing

To run the tests, just execute:

    $ ./build.js test

To run the linter:

    $ ./build.js lint

### Broken tests

Some tests are currently not run because they fail - this needs fixing before we
make any major changes:

- [podigree](podigree)
- [poly-api](poly-api)

The tests for [fetch-spec](fetch-spec) fail as well, but they already failed in
the [fetch-spec microrepo](https://github.com/polypoly-eu/fetch-spec) - since it
seems unrelated to the migration we can figure that one out later.

[the polyPod whitepaper]: https://polypoly.coop/static/polypoly_Whitepaper_polyPod.pdf
[node-polyfills issue]: https://github.com/ionic-team/rollup-plugin-node-polyfills/issues/17
