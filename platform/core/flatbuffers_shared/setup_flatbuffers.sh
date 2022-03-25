#!/bin/bash
set -e    # Exit if any command fails

echo '===> Setting up flatbuffers'

FLATBUFFERS_VERSION=v2.0.0
FLATBUFFERS_REPO=https://github.com/google/flatbuffers

cd flatbuffers_shared

echo "*** Cleaning previous flatbuffers config"
rm -rf flatbuffers
rm -rf flatc
echo "*** Ready to for fresh config ***"

echo "*** Clonning Flatbuffers repo ***"
git clone --branch $FLATBUFFERS_VERSION $FLATBUFFERS_REPO
echo "*** Flatbuffers $FLATBUFFERS_VERSION repo cloned ***"

echo "*** Installing flatc ***"    
# OSTYPE is set to the OS on which bash is executing;
# The default is system-dependent;
downloadLink=${FLATBUFFERS_REPO}/releases/download/${FLATBUFFERS_VERSION}
case "$OSTYPE" in
    darwin*)
        echo "OSX"
        downloadLink=${downloadLink}/Mac.flatc.binary.zip
    ;;
    linux*)
        echo "LINUX"
        downloadLink=${downloadLink}/Linux.flatc.binary.clang++-9.zip
    ;;
    msys*)
        echo "WINDOWS msys"
        downloadLink=${downloadLink}/Windows.flatc.binary.zip
    ;;
    cygwin*)
        echo "WINDOWS cygwin"
        downloadLink=${downloadLink}/Windows.flatc.binary.zip
    ;;
    *)
        echo "unsupported OS: $OSTYPE"
        exit 1
    ;;
esac

curl -L "$downloadLink" -o flatc.zip && unzip flatc.zip && rm flatc.zip
chmod +x flatc
echo "*** flatc $FLATBUFFERS_VERSION installed ***"

cd ..
echo '===> Flatbuffers configured!'