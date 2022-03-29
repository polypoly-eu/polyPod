# pod.js

A polyPod implementation that runs in a regular web browser.

## Reasoning

The polyPod uses a lot of web technologies under the hood, and modern
browsers ship with very powerful development tools, which makes web
browsers the ideal environment for developing polyPod features.

As for production use: A lot of features don't make sense in
isolation, yet those that do can be easily deployed on a HTTP server
by using `pod.js`.

## Limitations

Currently, any feature including `pod.js` will become a fully
functional polyPod, except for one thing: It only runs a single
feature. While we could support the creation of a container and a
mechanism for loading features in `pod.js` without too much trouble,
it is currently not implemented.

## Building

Simply run `./build.js` in the repository root.

## How to set up a feature to build with podjs

Follow these instructions to do so:

1.  You need to point to `podjs` from the `polypoly-eu` repository and
    add it as a "development dependency" on your project by running:

        $npm i <path-that-points-to-podjs> -D

    So, you end up having on your `package.json` the following:

    ```json
       "devDependencies": {
          "@polypoly-eu/podjs": "file:/path-that-points-to-podjs/",
          ...
       },

    ```

2.  The main step is to copy `pod.js` in your project. For this, please, check the `example` feature as guideline. You should be able to do it with `rollup` tooling (same way as in `example`) or any other script mechanism you desire.

3.  Make sure your `manifest.json` is exposed as `window.manifestData`.
    So, if your feature is written in JavaScript you should require the following in your main index file:

```js
import manifestData from "<path-to-your-manifest>/manifest.json";
window.manifestData = manifestData;
```

Accordingly in any other language.

4.  To verify that everything is in place, you can confirm it with the following steps:

    -   Open your feature's HTML file in your browser, URLs of your local file should be supported without the need to run an HTTP server.
    -   If you haven't forgotten 'step 3', you should have the correct navigation bar color and the (localized) feature name you have set.
    -   You can navigate backwards within the feature via the native back button functionality of the browser.

5.  If everything works, you are ready to start enjoying your new polyPod feature! :)
    Congrats!

        > Remember that while other features ship with a `pod.js` file, the polyPod simply ignores any local `pod.js` file and delivers their own version of it instead. Therefore, you can leave the `pod.js` file in the feature distribution without any implication.
