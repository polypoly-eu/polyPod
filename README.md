# polyPod

The polyPod

At the moment, the polyPod is essentially a runtime for _features_; small,
sandboxed JavaScript applications that can be launched from the polyPod app.

But it will be much more than that, for more information read [the polyPod
whitepaper].

## Components

- [android](android): The polyPod app for Android
- [features](features): polyPod features
- [core](core): The polyPod core code

## Requirements

Just [Node.js](https://nodejs.org/) version 15.x.

## Building

Just execute:

    $ ./build.js

After this you can build [android](android), or try
[features/example](features/example).

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

[the polyPod whitepaper]: https://polypoly.coop/static/polypoly_Whitepaper_polyPod.pdf
[node-polyfills issue]: https://github.com/ionic-team/rollup-plugin-node-polyfills/issues/17
