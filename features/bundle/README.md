# Feature bundle

Packages all the Features that are meant to be bundled with the polyPod.

## Adding a Feature

The bundle is configured via the `polyPodFeatures` key in
[package.json](package.json). You need to do a few more things, however:

1. Add the Feature's module to `devDependencies`.
2. Add the Feature to `polyPodFeatures`.
3. Run `npm install` to add the new dev dependency.
4. Finally, run `npm run build` to recreate the bundle.

Please note that step 3 is only necessary once, after adding a feature as a new
dev dependency.

The bundle is automatically picked up by [android](../../platform/android) and
[ios](../../platform/ios), so after recreating the bundle, the app needs to be
redeployed (e.g. simply launching it from Android Studio or Xcode).

## Deploying changes to a Feature

The bundle is, currently, only being automatically generated for a full
build. If you merely made a change in a Feature module, these changes will only
be reflected on the platform you're testing with after you recreate the bundle,
i.e. run `npm run build` again.
