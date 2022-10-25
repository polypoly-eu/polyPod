# polyPod for iOS

The polyPod app for iOS devices

## Building

### Prerequisites

Before building for iOS, you need to build the shared components and
Features - simply follow the build instructions in
[../../README.md](../../README.md).

As a summary, you will need to:

* Build the shared components in [`core`](../../core). You will probably be interested only in the `iOS` part
* The polyPod core and features are written in JavaScript. You will need to build and bundle them by running `./build.js` from the root directory of this repository. Please follow instructions [there](../../README.md) to install all needed prerrequisites. 

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
