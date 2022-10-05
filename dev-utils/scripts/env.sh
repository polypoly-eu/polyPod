# Some hopefully helpful checks and aliases for polyPod/feature development

if [ -n "$ZSH_VERSION" ]; then
    script_path="${(%):-%N}"
    rc_file=".zshrc"
else
    # We'll just assume people use either zsh or bash... :)
    script_path="${BASH_SOURCE[0]}"
    rc_file=".bashrc"
fi

echo "Setting up some aliases to make polyPod development more convenient."
echo
echo "Add this to your .zshrc or .bashrc if you like, e.g.:"
echo
echo "    echo '. `pwd`/$script_path >/dev/null' >> $rc_file"

echo
echo "Commands:"
echo
echo "polycli - Access dev-utils/poly-cli, the command line utility for"
echo "          generating new features, without having to specify its full"
echo "          path"
alias polycli="node '`dirname $script_path`/../dev-utils/poly-cli/index.js'"

echo
echo "polyepoch - Generate the current poly epoch, used for polyPod version"
echo "            numbers"
alias polyepoch='node -e "console.log(Math.round((Date.now() - new Date(\"2019-05-04 00:00:00 UTC\").getTime()) / 1000))"'

echo
echo "polyrepoch - Pass a poly epoch value as a parameter and generate the date"
echo "             it refers to"
polyrepoch() {
    node -e "console.log(new Date($1 * 1000 + new Date(\"2019-05-04 00:00:00 UTC\").getTime()).toLocaleString())"
}

if [ -z "$POLYPOD_BUILD_PLATFORMS" ]; then
    echo
    echo "\$POLYPOD_BUILD_PLATFORMS not set - you might want to set it to"
    echo "'android', 'ios' or 'all' if you're interested in building for these"
    echo "platforms, e.g.:"
    echo
    echo "    echo 'POLYPOD_BUILD_PLATFORMS=all' >> $rc_file"
fi
