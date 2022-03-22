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

## Prerequisites

Make sure you have already installed the following:

-   `node` `v16` or higher
-   `npm` `v7` or higher
-   `rollup` `v2.60` or higher
-   `shx` `v0.3.4` or higher

## Building

Simply run `./build.js` in the repository root.

## How to setup a feature to build with podjs

To create a polyPod compatible feature, you will need to use this module.
Follow these instructions to do so:

1.  In order to point to `podjs` from the polypoly-eu repository,
    add as a `development dependency` on your `package.json` the following:

      <code>

         "devDependencies": {
            "@polypoly-eu/podjs": "file: <path-that-points-to-platform/podjs>",
         },

      </code>

2.  We use the `rollup` module bundler to build our features all together via the script

    `$ rollup -c`

    which runs `rollup` and takes the `./src` directory as input, putting the result in a `dist` folder. Also, those configurations need to be defined
    in the `rollup.config.js` file.

    We basically rely on our in-house `[rollup-plugin-copy-watch](https://github.com/polypoly-eu/polyPod/blob/main/dev-utils/rollup-plugin-copy-watch/)` plugin
    on top of the `rollup` one which serves to copy files and folders with glob support
    and also offers an additional watch to other sources than just `rollup`'s bundle content.
    It needs to be installed as a dev dependency:

    `$ npm i --save-dev ../../dev-utils/rollup-plugin-copy-watch`

    Which odes to a `package.json` file that includes this dependency:

         "devDependencies": {
            "@polypoly-eu/rollup-plugin-copy-watch": "file:../../dev-utils/rollup-plugin-copy-watch",
         },

    With the above, we make sure the feature uses our custom `@polypoly-eu/rollup-plugin-copy-watch"` plugin to watch the copied files. To be able to do so, add a `watch` script on your `package.json`:

         "scripts": {
            "watch": "rollup --watch -c",
         },

and run `$ npm run watch` when you desire to start watching the process.

3. Next step, you need to define your `rollup.config.js` at the same level as your `package.json`.

    There you need to have the `copy` (of our `"@polypoly-eu/rollup-plugin-copy-watch"`) under the `plugins` section with the `targets`
    setup for `src`, which in this case it's the `"node_modules/@polypoly-eu/podjs/dist/pod.js"`, and `dest` where it will be ended to (e.g. `dist`).
    So, it looks like:

```
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
    which will run the `rollup` command. For example, for typescript directories, you can use:

```
   {
      ...
      "scripts": {
         "build": "shx rm -rf dist && tsc && rollup -c rollup.config.js",
         ...
      },
   }
```

5.  You are ready to build your feature. Try:

    `$ npm run build`

    and you should have a `dist` folder with your feature included the `pod.js` file.

6.  Don't forget to include the `pod.js` from your feature's main document - before the feature's own code.
