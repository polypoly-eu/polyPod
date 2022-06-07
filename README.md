# The polyPod

At the moment, the polyPod is essentially a runtime for _features_; small,
sandboxed JavaScript applications that can be launched from the polyPod app.

But it will be much more than that. For more information please read the
[polyPod whitepaper][1].

## Structure

- [platform](platform): The polyPod platform
- [features](features): polyPod features
- [feature-utils](feature-utils): Utilities used by features
- [assets](assets): Assets shared across the polyPod and features
- [build](build): The build logic
- [dev-utils](dev-utils): Utilities used at build time

## Requirements

Just [Node.js](https://nodejs.org/) version 16.x or newer.

## Building

If you're on Windows, please follow the steps in
[dev-utils/windows](dev-utils/windows) first.

In general, you just need to run:

    $ ./build.js

> (Yes, we have a custom build script, you can read more about why [here](build)
> if you're curious.)

This will build the platform independent code, including all the bundled
features, as well as [podjs](platform/podjs).

After this you can build the [platform](platform)
(e.g. [android](platform/android) or [ios](platform/ios)), or try one of the
features (e.g. [features/example](features/example)).

## Testing

To run the tests, just execute:

    $ ./build.js test

## Linting

Linting is done via tools configured at the top level (root) directory.

To run the linter:

    $ ./build.js lint

> Please note that this won't trigger tests or linting for non-JS code, for
example [android](android).

If linting reveals some error, they can be fixed with

    $ ./build.js lintfix

Although just doing the linting will reveal the rules, there are a couple of
sources for this configuration:

* [`.editorconfig`](.editorconfig) for general editor configuration.
* [`.eslintrc.cjs`](.eslintrc.cjs) for specific JS/TS linting rules.

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

## Issues and contributions

Please see [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Licensing

Copyright © 2021-2022 pc polypoly coop SCE mbH

Licensed under the GNU General Public License, Version 3.  Please see the
[LICENSE](LICENSE) document for details and a copy of the license.

License information of 3rd party components is available in the
[3rd-party-licenses/](3rd-party-licenses) directory.

## Trademarks

- polypoly® is a registered trademark of polypoly Enterprise GmbH
- polyPod® is a registered trademark of pc polypoly coop SCE mbH
- polyPedia® is a registered trademark of polypoly Foundation gGmbH

[1]: https://polypoly.coop/static/polypoly_Whitepaper_polyPod.pdf
