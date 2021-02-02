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

### CLI for building and testing Features

The [orodruin](orodruin) package includes everything needed to develop and test
features.

### polyPod app for Android

You can find the Android version of the polyPod in
[polyPod-Android](polyPod-Android).

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

Currently, it appears _orodruin_ is only being built correctly when referencing
_podigree_ using Yarn's `file:` rather than `link:` protocol. Since we are
currently using the `link:` protocol, _orodruin is currently broken_. You can
tell if you try to run [orodruin/example](orodruin/example).

If we can't fix this issue, we have to revert to Yarn 1.x and using the `file:`
protocol for the _podigree_ dependency in _orodruin_. Yarn 2.x supports the file
protocol as well, but this will make _orodruin_'s `yarn.lock` file unstable.

If we do manage to fix this, we can probably switch to `nodeLinker: pnp` and
Yarn workspaces, eliminating most/all of the logic currently in `build.js`.

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
