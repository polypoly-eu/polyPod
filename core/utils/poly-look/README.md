# polyLook

polyLook is the visual component library for all features and applications included in polyPod. The library used to encode each of the different components is litElement. The reason for that choice is because litElement creates packages with standard code in js that does not need any other library or framework to work in the browser. It also makes the litElement component compatible with all kinds of front end applications no matter what framework it is encoded with. You can learn how to use litElement in the following [tutorials](https://lit.dev/docs/)

## Quick guide:

- **run storybook**: `npm run storybook`
- **run test**: `npm test`
- **run lint**: `npm run lint`
- **build library**: `npm run build`

## polyLook in-between react and lit component libary

polyLook is momentary even though there are many usable lit-elements primarily used as a react component libary. This means it is not included in the html but imported through bundling with rollup. In the future lit-components can receive a react wrapper and be used like a react component. React components, which are currently used are waiting in `src/incubate` to be translated into lit-elements with react wrappers.

## Steps to code a new polyLook component

1- Write the js file of the component inside the src folder. The name of the file must be written in lowerCamelCase.

2- To test the component we'll use the storybook. To use the new component inside the storybook app we have to write a `*.stories.js` file inside the `stories` folder with the same name of the component. In order to learn how to write a `*.story.js` file you can read the next [tutorial](https://storybook.js.org/docs/web-components/writing-stories/introduction).

3- Each component is required to have its own unit and integration tests. The test coverage for each component must be at least 70%.

4- To make the component public through the bundle file, the component must be imported into the polyLook.js file and create a custom label with the name of the component in kebab-case.

Example:
If we have a component called PolyButton.js inside the polyLook.js we must add the next lines:

```javascript
import PolyButton from "./src/PolyButton";

window.customElements.define("poly-button", PolyButton);
```
