# The polyPod

The polyPod is a personal data store and privacy-preserving runtime environment
for privacy-conscious computations. It executes _Features_; small, sandboxed
JavaScript applications that can be launched by the user and interact with their
personal data.

It is still under heavy development, and some aspects are missing or
unrefined. For more on the vision please read the [polyPod whitepaper][1].

## Structure

- [platform](platform): The polyPod platform
- [features](features): polyPod Features
- [feature-utils](feature-utils): Utilities used by Features
- [assets](assets): Assets shared across the polyPod and Features
- [build](build): The build logic
- [dev-utils](dev-utils): Utilities used at build time

To better understand the architecture, have a look at
[docs/architecture.md](docs/architecture.md).

## Requirements

The main thing you need is [Node.js](https://nodejs.org/) version 16.x or newer.

In order to build for Android or iOS (see below), have a look at the
requirements in [platform/core/README.md](platform/core/README.md), which is
needed for both, and then
[platform/android/README.md](platform/android/README.md) or
[platform/ios/README.ms](platform/ios/README.md) respectively.

## Setting the target platform

The polyPod runs on several platforms. You can control which platforms to build
for using the `POLYPOD_BUILD_PLATFORMS` environment variable.

Regardless of what you set it to, even if you don't set it, _podjs_ will always
be built - which is sufficient to run and develop Features.

In order to build the polyPod for other platforms, set `POLYPOD_BUILD_PLATFORMS`
to one of the following values:

- `all`
- `android`
- `ios`

## Building

If you're on Windows, please follow the steps in
[dev-utils/windows](dev-utils/windows) first.

In general, you just need to run:

    $ ./build.js

> (Yes, we have a custom build script, you can read more about why [here](build)
> if you're curious.)

This will build the platform independent code, including all the bundled
Features, as well as [podjs](platform/podjs), a browser-based implementation of
the polyPod.

After this you can build the [platform](platform)
(e.g. [android](platform/android) or [ios](platform/ios)), or try one of the
Features (e.g. [features/example](features/example)).

## Testing

To run the tests, just execute:

    $ ./build.js test

## Developer tips

We've defined some helpful aliases you might enjoy:

    $ . dev-utils/scripts/env.sh

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

Please read the [`SECURITY`](SECURITY.md) document on how to report potential
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

- polypoly® is a registered trademark of polypoly Enterprise GmbH and pc polypoly coop SCE mbH
- polyPod® is a registered trademark of pc polypoly coop SCE mbH
- polyPedia® is a registered trademark of polypoly Foundation gGmbH

[1]: https://polypoly.net/en/blog/whitepaper-in-pod-we-trust-our-technological-centrepiece/
