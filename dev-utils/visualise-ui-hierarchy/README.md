# Visualise (the) UI hierarchy (of polyPod features)

An experimental setup for analysing and visualising UI component hierarchy and
reuse in polyPod features.

## Requirements

Aside from the stuff you probably already have (Node, Make, Python and Git), you
will need [Graphviz](https://graphviz.org) and [Yarn
1.x](https://classic.yarnpkg.com/).

## Usage

fhd's fork of the react-component-hierarchy tool generates a, seemingly correct,
tree view of the component hierarchy. The little `tree2dot` script then converts
the UTF-8-art tree into a proper graph in dot notation. Finally, Graphviz is
used to render that graph visually as an SVG.

The Makefile takes care of all this, so to just generate the SVG for
polyExplorer, you can run:

    make polyExplorer.svg

If, for whatever reason, you only want the dot file, you can use:

    make polyExplorer.dot

And so on and so forth.

## Known issues

### Graph layouting

Graphviz with the _fdp_ layout we're currently using seems alright, but it is
far from beautiful or easy to read. Given that we generate graphs in the _dot_
format, we could explore other visualisation options for those - with or beyond
Graphviz.

### Irrelevant files

The react-component-hierarchy tool lists some things as UI components that
really aren't, like contexts. I suppose it's just tricky to tell the difference,
but we could at least filter those.

### Incomplete hierarchy

Even with fhd's improvements, the react-component-hierarchy tool can't seem to
handle all edge cases, e.g. the analysis views in the facebookImport feature are
not detected.

### Merged hierarchy

While our individual features are currently somewhat separate, later on it could
become interesting to generate a single dot file that captures them all. At the
moment, we generate one dot file, and hence visualisation, per feature.

### Beyond React

This will all fall apart as soon as we transition away from React as the lingua
franca for polyLook components, which would put us in a position where we'd have
to generate component hierarchies across different component frameworks - sounds
like quite a bit of work.
