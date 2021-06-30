# The polyPod

At the moment, the polyPod is essentially a runtime for _features_; small,
sandboxed JavaScript applications that can be launched from the polyPod app.

But it will be much more than that, for more information read [the polyPod
whitepaper].

## Components

- [android](android): The polyPod app for Android
- [ios](ios): The polyPod app for iOS
- [podjs](podjs): A module that lets features run in a web browser
- [features](features): polyPod features
- [core](core): The polyPod core modules
- [build](build): The build logic

## Requirements

Just [Node.js](https://nodejs.org/) version 16.x or newer.

## Building

Just execute:

    $ ./build.js

This will build the cross platform code base - mainly the core code and bundled
features.

After this you can build [android](android), [ios](ios), or try one of the
features, e.g. [features/example](features/example).

> (Yes, we have a custom build script, you can read more about why [here](build)
> if you're curious.)

## Testing

To run the tests, just execute:

    $ ./build.js test

To run the linter:

    $ ./build.js lint

> Please note that this won't trigger tests or linting for non-JS code, for
example [android](android).

If linting reveals some error, they can be fixed with 

    $ ./build.js lintfix

## Branches

Ongoing development is happening in the `main` branch. We aim to keep it stable
at all times, but it is not as thoroughly tested as our releases. This is the
branch to make contributions against.

We prepare releases in the `release` branch. If no release is in progress, it
reflects the state of the last release we made.

## Security

Please read the [SECURITY](SECURITY.md) document on how to report potential
security vulnerabilities in polyPod and where to find polypoly's Vulnerability
Disclosure Policy.

## Issues, contributions.

Please see [`CONTRIBUTING.md`](CONTRIBUTING.md).


## Links

[the polyPod whitepaper]: https://polypoly.coop/static/polypoly_Whitepaper_polyPod.pdf


## Licensing

Copyright (c) 2021 pc polypoly coop SCE mbH

Licensed under the GNU General Public License, Version 3 with Additional Terms.

Please see the [LICENSE](LICENSE) document for details and a copy of the
license and additional terms.

