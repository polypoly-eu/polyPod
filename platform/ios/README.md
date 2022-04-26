# polyPod for iOS

The polyPod app for iOS devices

## Building

### Prerequisites

The main prerequisite you need are the polyPod features and the feature API -
simply follow the build instructions in [../../README.md](../../README.md).

In addition, you will need to build the shared core code manually (for now), see
[../core/README.md](../core/README.md).

### Xcode

Just open the _PolyPodApp_ project in Xcode and build, test or archive it there.

### Command line

#### Ensuring the build works

    make build

#### Running the tests

    make test

#### Creating an archive

    make archive

Creating an `xcarchive` is a prerequisite for creating the actual app package
for upload to the App Store. This process is not fully automated yet.

#### Linting

Linting is performed via [`swiftlint`](https://github.com/realm/SwiftLint). Use
any of the available ways to do it yourself.
