# polyPod for Android

This directory contains the source for the polyPod app for Android devices.

## Building

### Prerequisites

Before building for Android, you need to build the shared components and
Features - simply follow the build instructions in
[../../README.md](../../README.md).

### Android Studio

We recommend [Android Studio] if you want to work on the code; simply install it
and open this directory as an existing project.

### Command line

If you merely want to build the code, get:

1. [OpenJDK 11]
2. [Android SDK command line tools]

Then set `sdk.dir` in your local `local.properties` and finally run:

```
./gradlew assemble
```

## Testing

With a device connected (real or emulated), execute the `connectedAndroidTest`
task; the `test` task will run all the tests.

> *Note*: testing includes the Java *and* Kotlin tests, although the former need
> to be checked to see if they actually run.

### Linting

We use [ktlint](https://github.com/pinterest/ktlint) for linting sources, and
that it conforms to the usual standards. It will be run automatically when
you push or create a pull request, but you can download, put it somewhere in the
path,  and then run it with

```
ktlint
```

in this directory.

Additionally, a `gradle` target for linting has been added; use

```shell
./gradlew ktlintCheck
```

to check the report.

## Installing Features at runtime

The polyPod already bundles all the Features it ships with, but it will also load
additional Feature packages from the `files/features/` directory on the device's
internal storage. You can manually push a Feature there by using `adb push` to
get it on the device, and `adb shell run-as coop.polypoly.polypod` to copy it
into the polyPod's internal file storage. Please note that Features installed
this way will be automatically deleted when the polyPod app is being
uninstalled.

[Android Studio]: https://developer.android.com/studio
[Android SDK command line tools]: https://developer.android.com/studio/index.html#command-tools
[OpenJDK 11]: https://openjdk.java.net
