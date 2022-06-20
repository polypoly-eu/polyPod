# poly-cli

Generates stuff for us. Currently only generates the structure for a feature.

## Use

First install with `npm ci`

Run inside `features/` folder:

```shell
node ../dev-utils/poly-cli/index.js create feature --type preview
```

There are 3 types: `empty`, `preview`, and `importer`. `empty` is the default
