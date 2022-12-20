# Feature bundle

Packages all the Features that are meant to be bundled with the polyPod.

## Adding a Feature

The bundle is configured via the `polyPodFeatures` key in
[package.json](package.json). You need to do a few more things, however:

1. Add the Feature's module to `devDependencies`.
2. Add the Feature to `polyPodFeatures`.
3. Add the Feature to an existing category under `polyPodCategories` - these
   categories determine whether and where a Feature shows up on the home screen.
4. Run `npm install` to add the new dev dependency.
5. Finally, run `npm run build` to recreate the bundle.

Please note that step 4 is only necessary once, after adding a Feature as a new
dev dependency.

The bundle is automatically picked up by [android](../../platform/android) and
[ios](../../platform/ios), so after recreating the bundle, the app needs to be
redeployed (e.g. simply launching it from Android Studio or Xcode).

## Deploying changes to a Feature

The bundle is, currently, only being automatically generated for a full
build. If you merely made a change in a Feature, these changes will only be
reflected on the platform you're testing with after you recreate the bundle,
i.e. run `npm run build` again. Most Features also have a convenience script
that takes care of this for you, so you can mostly just run `npm run
build-downstream` from the Feature, and it will recreate the bundle as well.

## Adding your Feature to the build

While adding your Feature to the bundle is good enough for development and
testing purposes; if you are serious about bundlign it, you also need to add it
to the polyPod build, so it gets built automatically. See
[../../build/README.md](../../build/README.md).

## The developer category

Looking at [package.json](package.json), you may have noticed the `developer`
section. We set its `visible` property to `false` before publishing a public
release, so end users won't see it, and won't be able to launch the Features
listed in it. If you're working on something experimental, or something that is
only useful for development or testing, you might want to add your Feature
there.
