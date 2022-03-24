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

    `$npm i <path-that-points-to-platform/podjs --D`

    So, you end up having on your `package.json` the following:

    ```json
       "devDependencies": {
          "@polypoly-eu/podjs": "file: <path-that-points-to-platform/podjs>",
          ...
       },

    ```

2.  The important step is to copy `pod.js` in your project. Here, we will guide you to do it with `rollup` tooling, but feel free to use your preferences.

    We use the `rollup` module bundler to build our features all together via the script

             $ rollup -c

    which runs `rollup` and takes the `./src` directory as input, putting the result in a `dist` folder. These configurations need to be defined
    in the `rollup.config.js` file.

    We basically rely on our in-house [rollup-plugin-copy-watch](https://github.com/polypoly-eu/polyPod/blob/main/dev-utils/rollup-plugin-copy-watch/) plugin
    on top of the `rollup` one which serves to copy files and folders with glob support
    and also offers an additional watch to other sources than just `rollup`'s bundle content.
    It needs to be installed as a dev dependency:

             $ npm i --save-dev ../../dev-utils/rollup-plugin-copy-watch

    So, the `package.json` file includes it as a dev dependency, like this:

    ```json
       "devDependencies": {
          "@polypoly-eu/rollup-plugin-copy-watch": "file:../../dev-utils/rollup-plugin-copy-watch",
          ...
       }
    ```

    This way we make sure the feature uses our custom [rollup-plugin-copy-watch](https://github.com/polypoly-eu/polyPod/blob/main/dev-utils/rollup-plugin-copy-watch/) plugin to watch the copied files. To be able to do so, add a `watch` script on your `package.json`:

    ```json
       "scripts": {
          "watch": "rollup --watch -c",
       },
    ```

    and run

                  $ npm run watch

    when you desire to start watching the process.

3.  Next step, you need to define your `rollup.config.js` at the same level as your `package.json`.

    In this `rollup.config`, following our current way, not obligatory though, you could have the `copy` (of our `"@polypoly-eu/rollup-plugin-copy-watch"`) under the `plugins` section with the `targets`
    setup for `src`, which in this case it's the `"node_modules/@polypoly-eu/podjs/dist/pod.js"`, and `dest` where it will be ended to (e.g. `dist`).
    So, it looks like:

```js
   import copy from "@polypoly-eu/rollup-plugin-copy-watch";

   export default {
      input: "src/your-input-file.js",    // point to your source file
      output: {
         file: "dist/myfile.js", // point to your output file
         format: "iife",     // the format of your output file, for now only iife is supported
         globals: {
               // where you define all the external packages you want to use
               pod: "pod",
            },
         }
      },
      plugins: [
         ...
         copy({
            targets: [
            {
               src: [
                  "node_modules/@polypoly-eu/podjs/dist/pod.js",
                  ...
               ],
               dest: "dist",
            },
         ]
         }),
      ]
   }
```

This way you have copied successfully the `pod.js` file from the `@polypoly-eu/podjs` module, and you can use it in your feature.

4.  So, to compile the input files and run the previous configurations,
    you should define a `build` script in the `package.json` file,
    which will run the `rollup` command.

    For example, for Javascript features, you can use:

```json
   {
      ...
      "scripts": {
         "build": "shx rm -rf dist && rollup -c",
         ...
      },
   }
```

Or for Typescript features, you will also need to compile with `tsc`:

```json
   {
      ...
      "scripts": {
         "build": "shx rm -rf dist && tsc && rollup -c",
         ...
      },
   }
```

5.  You are ready to build your feature. Try:

    `$ npm run build`

    and you should have a `dist` folder with your feature included the `pod.js` file.

6.  Now, the second important step is to include the `pod.js` from your feature's main document, before the feature's own code.
    So, in your feature's `HTML` file, you should along with the rest polyPod implementations make sure you include `pod.js` script, like this:

```html
<html>
    <head>
        <meta charset="utf-8" />
        <script src="pod.js"></script>
        ...
    </head>
</html>
```

7.  Make sure your manifest data feature file is exposed as `window.manifestData`.
    So, if your feature is written in `JavaScript` you should require the following in your main index file:

```js
import manifestData from "./static/manifest.json";
window.manifestData = manifestData;
```

Accordingly in any other language.

8.  To verify that everything is in place, you can confirm it with the following steps:

    -   Open your feature's `HTML` file in your browser, `URL`s of your local file should be supported without the need to run an `HTTP server`.
    -   If you haven't forgotten step 7, you should have the correct navigation bar colour and the (localized) feature name you have set.
    -   You can successfully navigate backwards within the feature via the native back button functionality of the browser.

9.  If everything works, you are ready to start enjoying your new polyPod feature! :) Congrats!

    > As other `polyPod` platforms will simply ignore the local `pod.js` file and deliver their own version of it, you can leave the `pod.js` file in the feature distribution without any implication.

```

```
