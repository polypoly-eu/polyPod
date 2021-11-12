# polyExplorer

A feature that lets you browse through companies and how they use and share
personal data.

## Building

Follow the build instructions in the [top-level README](../../README.md) -
polyExplorer is being built as a part of this.

You can build it individually by running:

    $ npm run build

You can automatically rebuild it whenever one of the source files changes by
running:

    $ npm run watch

## Run

This is a web-based application. `npm run build` will create the SPA in the
`dist` subdirectory. Just point your browser at `dist/index.html`.

## Updating company data

polyExplorer takes its data from [the polyPedia database]. For development on
the feature, you can ignore this, but if you want to pull in the latest changes
from polyPedia, or overwrite data coming from it, the process is like this:

### Updating to a newer version of polyPedia

The version of polyPedia used in polyExplorer is set in `package.json`. After
changing it, the following command pulls in the latest source data:

    $ npm run polypedia:fetch

### Importing polyPedia data into polyExplorer

The previous command doesn't change the data used by polyExplorer, so whenever
you update data from polyPedia, you also need to import it:

    $ npm run polypedia:convert

This will write a new version of `src/data/companies.json` and
`src/data/global.json`, which you should commit. If nothing changed in these
files, that means that either there were no relevant updates in polyPedia, or
that the conversion script needs to be modified to correctly import the new
data.

### Modifying data coming from polyPedia

You should never modify `src/data/companies.json` or `src/data/global.json`
directly. Ideally, any problems in the data should get resolved upstream in
polyPedia, then you can simply update and import the data again.

When that is not possible, you can apply your modifications in
`scripts/patch-data.js`, and re-run `npm run polypedia:convert`.

[the polyPedia database]: https://github.com/polypoly-eu/polypedia-data

### Working with data

All data is in the [`src/data`](src/data) directory. It's in JSON, you can work with it using `jq`. For instance, to extract all the jurisdictions present in the data you can use:

```sh
cat src/data/companies.json| jq "[.[] | .jurisdiction ] | unique"
```