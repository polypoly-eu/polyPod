# lexicon

A Feature that lets you look up terms and words used in the polypoly ecosystem.

## Building

Follow the build instructions in the [top-level README](../../README.md) -
Lexicon Feature is being built as a part of this.

You can build it individually by running:

    $ npm run build

You can automatically rebuild it whenever one of the source files changes by
running:

    $ npm run watch

## Update lexicon data (only for polypoly staff)

To update the data you need a prismic-API access token, if you need to update the data and don't have one ask the system admins or the IT.

To update the data you can run:

    $ npm run update-lexicon-data -- {your-access-Token}

Yes there is a space between "--" and the token.
