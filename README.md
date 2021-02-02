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

- [orodruin/example](orodruin/example) is an example feature that uses some
  polyPod APIs.
- [testFeature](testFeature) is a feature polyPod implementations can write test
  against, to verify it all works properly end to end.
- [polyHello-feature](polyHello-feature) is the most trivial feature imaginable,
  currently being bundled with the polyPod.

### The shared polyPod core code

All the other packages contain the internal workings of the polyPod, such as the
feature runtime execution environment. Refer to the individual packages to learn
more about what they are for, but note that we aim to improve the structure,
naming and documentation to make things more understandable.

## Requirements

- [Node.js](https://nodejs.org/) version 14.10.1 or newer
- [Yarn](https://yarnpkg.com/) version 2.4.0 or newer\
  (`npm install -g yarn` will do)

## Building

Just execute:

    $ ./build.js

After this you can build [polyPod-Android](polyPod-Android), or
[orodruin/example](orodruin/example).

### Wat

Yes, we have a nasty custom build script.

The initial polyPod code base is composed of various small modules that used to
live in different repositories, including each other via package
registries. After migrating these projects into a single repository, we kept
them as separate packages for now. Building these properly turned out to be a
challenge.

Now that we've worked out the last kink around linked node modules, and since
we're using Yarn 2.x, we should be able to switch to workspaces to eliminate
quite a bit of the logic in `build.js`.

If we want to switch to `nodeLinker: pnp`, we have to find a better workaround
for _rollup-plugin-node-polyfills_ to discover modules, however. Out of the box,
[it doesn't support links in `node_modules`][node-polyfills issue], let alone
pnp.

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
