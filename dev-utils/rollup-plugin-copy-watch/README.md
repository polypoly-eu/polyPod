# rollup-plugin-copy-watch

Trivial [Rollup] plugin that wraps the [rollup-plugin-copy] to watch all copied
files.

There's already a [rollup-plugin-copy-watch] out there that should do this, but
when we tried to use it it actually triggered watch mode for regular builds for
some reason. Ideally we should get rid of this self written plugin in favour of
something maintained by somebody else, but for now writing a few lines of code
ourselves was the easiest thing to do.

[Rollup]: https://rollupjs.org/guide/en/
[rollup-plugin-copy]: https://github.com/vladshcherbin/rollup-plugin-copy
[rollup-plugin-copy-watch]: https://www.npmjs.com/package/rollup-plugin-copy-watch
