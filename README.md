## polyPod for Android

Project is still in a very early phase, contains only one hardcoded Feature and provides just enough infrastructure to let that Feature successfully execute.

### Android API version

Although it declares itself as an app that would work with devices using Android API of at least 23, currently it is not tested for that and requires probably a higher API version. Still, the idea is to support devices running at least Marshmallow / 6.0 / M / API 23 release. Going below would be problematic, because only starting with API 23 Android provides a possibility to:
* specify runtime requirements and
* better support for aps working in background.

We might later on decide to increase the minimal version.

### Testing

Currently, there is only a handful of tests, mostly serving as an example of how testing could work. Those tests require a connected running device of some sort, real or emulated. Once such a device or emulator is connected and running, you can execute the tests using `connectedAndroidTest` gradle task. Gradle output is a bit lacking, but you should be able to find a report from tests execution [here](app/build/reports/androidTests/connected/index.html). 
