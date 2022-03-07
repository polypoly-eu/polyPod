# polyPod for Android

This directory contains the source for the polyPod app for Android devices.

## Building

Before you do anything else, ensure you've built the core code and features: See
the [`README` file](../README.md) above.

### Android Studio

We recommend [Android Studio] if you want to work on the code; simply install it
and open this directory as an existing project.

### Command line

If you merely want to build the code, get:

1. [OpenJDK 11]
2. [Android SDK command line tools]

Then set `sdk.dir` in `local.properties` and finally run:

```
./gradlew assemble
```

## Testing

With a device connected (real or emulated), execute the `connectedAndroidTest`
task.

### Linting

We use [ktlint](https://github.com/pinterest/ktlint) for testing the source, and
that it conforms to the usual standards. It will be run automatically when
you push or create a pull request, but you can download, put it somewhere in the
path,  and then run it with

```
ktlint
```

in this directory.

Additionally, a gradle target for linting has been added; use

```shell
./gradlew ktlintCheck
```

to check the report.

## Installing features at runtime

The polyPod already bundles the features it ships with, but it will also load
additional feature packages from the `files/features/` directory on the device's
internal storage. You can manually push a feature there by using `adb push` to
get it on the device, and `adb shell run-as coop.polypoly.polypod` to copy it
into the polyPod's internal file storage. Please note that features installed
this way will be automatically deleted when the polyPod app is being
uninstalled.

[Android Studio]: https://developer.android.com/studio
[Android SDK command line tools]: https://developer.android.com/studio/index.html#command-tools
[OpenJDK 11]: https://openjdk.java.net
