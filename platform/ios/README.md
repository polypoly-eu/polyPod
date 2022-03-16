# polyPod for iOS

The polyPod app for iOS devices

## Building

No matter how you intend to build the iOS app, the first step is to build the
core code and features, see [../README.md](../README.md) for instructions.

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

Linting is performed via [`swiftlint`](https://github.com/realm/SwiftLint).
