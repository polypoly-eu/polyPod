# polyLook

polyLook is the visual component library for all Features included in the
polyPod applications.

The components are mainly based on React, although there are some LitElement
components created and documented. The reason for that choice is because
litElement creates packages with standard code in js that does not need any
other library or framework to work in the browser. It also makes the litElement
component compatible with all kinds of front end applications no matter what
framework it is encoded with. You can learn how to use litElement in the
following [tutorials](https://lit.dev/docs/).

To see the components in action, have a look at the
[preview](https://polypoly-eu.github.io/polyPod/feature-utils/poly-look-preview).

## Quick guide:

- **Run test**: `npm test`
- **Run lint**: `npm run lint`
- **Build library**: `npm run build`
- **Build documentation**_ `npm run doc`

## State of polyLook

polyLook aims to be a framework agnostic component library for polyPod
Features. At the moment, however, it mainly contains React components in actual
use throughout several Features, and prototypes for a potential
approach based on Lit elements.

Visualisations and charts are located in `./src/visualisations` and
`./src/visualisations/charts` respectively. When using these from a specific
framework eg. React, wrapper functions can be used
(`./src/visualisations/wrappers`).

## Steps to code a new polyLook component based on Lit

1- Write the JS file for the component inside the `src/lit-components`
folder. The name of the file must be written in lowerCamelCase.

2- To test-drive and document the component we'll use the [storybook
framework](https://storybook.js.org/). The necessary setup and stories are
[here](./storybook/). To use the new component inside the storybook app we have
to write a `*.stories.js` file inside the `storybook/stories/lit-components`
folder with the same name of the component. In order to learn how to write a
`*.story.js` file you can read the next
[tutorial](https://storybook.js.org/docs/web-components/writing-stories/introduction). Please
note that StoryBook is not built by default; you'll need to change to that
specific directory and run `npm ci`.

3- Each component is required to have its own unit and integration tests. You
should try and get the coverage for this new component up to 70%. This test will
use a copy of Chrome or Chromium available on the path, so you need to make sure
that it's usable and available in the path.

4- To make the component public through the bundle file, the component must be
imported into the polyLook.js file and create a custom label with the name of
the component in kebab-case.

Example:

If we have a component called PolyButton.js inside the polyLook.js we must add the next lines:

```javascript
import PolyButton from "./src/PolyButton";

window.customElements.define("poly-button", PolyButton);
```
