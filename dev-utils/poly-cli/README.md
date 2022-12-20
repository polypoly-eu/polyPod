# poly-cli

A command line utility to generate polyPod Features.

It's still in its infancy. The vision for this tool is to be something that
doesn't just generate initial scaffolds for a variety of typical Features, but
also aids development beyond that point, similar to the Ruby on Rails command
line utility.

## Usage

At the moment, it only works if you run it from the `features/` directory,
because the paths to the local Feature utilities are hard coded.

So to generate an empty feature:

    cd features
    node ../dev-utils/poly-cli/index.js create feature feature-name

Other than `empty` (the default), there are templates for `preview` Features and
`importer` Features, which you can specify with the `--type` option.

To make the command line shorter, you can source [env.sh](../scripts/env.sh),
e.g.:

    cd features
    . ../dev-utils/scripts/env.sh
    polycli create feature feature-name
