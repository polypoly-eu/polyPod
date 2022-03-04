# Storybook for polyLook

This directory contains the necessary setup for using the [storybook framework](https://storybook.js.org/) for our `polyLook` components.
## How to use

- Run `npm install`

- Depending on what type of component you are working, run one of the following:  
  - **For LitElement**: `npm run storybook:lit`
  - **For React**: `npm run storybook:react`
-
### Note
For the LitElements we use [@web/dev-server-storybook](https://github.com/modernweb-dev/web/tree/master/packages/dev-server-storybook) because it replaces `webpack` with `rollup` and `rollup` is the bundler that we use in `polyLook`. However it has no current support for `React`, so the React component stories are bundled using `webapck`. While that shouldn't cause issues, it's something to keep in mind. 