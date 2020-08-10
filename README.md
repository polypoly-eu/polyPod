## polyPod for Android

Project is still in a very early phase, contains only one hardcoded Feature and provides just enough infrastructure to let that Feature successfully execute.

### Android API version

Although it declares itself as an app that would work with devices using Android API of at least 23, currently it is not tested for that and requires probably a higher API version. Still, the idea is to support devices running at least Marshmallow / 6.0 / M / API 23 release. Going below would be problematic, because only starting with API 23 Android provides a possibility to:
* specify runtime requirements and
* better support for aps working in background.

We might later on decide to increase the minimal version.

Addendum: commit [551aaf0e](https://github.com/polypoly-eu/polyPod-Android/commit/551aaf0e5d2240552f685cbf90fb9921701fafe9) introduces usage of `Files.probeContentType()` and `File.toPath()`, both require at least API 26, so our contract is broken. Both calls are used to guess mime types when serving Feature files and are expected to be replaced later on as installing and loading of Features will get properly specified, currently they're not.

### Testing

Currently, there is only a handful of tests, mostly serving as an example of how testing could work. Those tests require a connected running device of some sort, real or emulated. Once such a device or emulator is connected and running, you can execute the tests using `connectedAndroidTest` gradle task. Gradle output is a bit lacking, but you should be able to find a report from tests execution [here](app/build/reports/androidTests/connected/index.html). 

Although I've tried using Robolectric, it doesn't seem to be possible right now. So far all the tests require either a WebView where Features are loaded and do something, or they expect some state of the Pod, namely existence of an installed "testFeature". Robolectric doesn't handle WebViews, indeed that would be an overkill. Second condition cannot be fulfilled inside unit tests. Therefore, there are only connected tests so far.

### Target and temporary implementations

Current status of the code is a mix between things that are already agreed upon and things that are merely made to work. The first ones are written in a better way and are tested, the latter work for me™. For now the only two things that's specified and agreed upon are how Features should initialize and how the communication between the Features and the Pod should look like. Current implementation and tests cover only parts of those two topics, simply because the only Feature that they should support in the [Questionnaire Feature](https://github.com/polypoly-eu/questionnaire-feature).

Almost everything else is written in such a way that one can start the Feature and that the Feature can display something on the screen. As more and more aspects will get clarified and properly specified, the implementation will follow.

### Feature loading

The Pod bundles no Features, but expects them as zipped files in `/sdcard/Android/data/eu.polypoly.pod.android/files/features/` directory. On one hand this directory is available from outside, so one can copy some features there using adb tool: `adb push --sync feature.zip /sdcard/Android/data/eu.polypoly.pod.android/files/features/`. On the other the Features will be automatically deleted on uninstalling the Pod itself and that will happen quite often during development. In the target picture it might be a good idea, but as the platform gets more and more restrictive, it might get a bit painful at times, yet I didn't find a better solution.

File format is very simple: at the root there needs to be an `index.html` file and any other file in the archive will be addressed using path relative to this `index.html` file. That currently means that just zipping od `dist` directory created after building Features will do.
