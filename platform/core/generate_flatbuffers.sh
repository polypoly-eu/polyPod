#!/bin/bash
set -e    # Exit if any command fails

echo '===> Generating Schema...'

FLATBUFFER_PATH=flatbuffers
FLATBUFFERS_VERSION=v2.0.0

SCHEMA_PATH=./src/flatbuffers_generated

FLATBUFFER_MODELS=$( find -P flatbuffer_models -name "*.fbs" )

# check is flatbuffer installed or not
FLATC=$FLATBUFFER_PATH/flatc

if [ ! -e $FLATC ]; then
    echo "*** installing flatc ***"
    
    rm -rf $FLATBUFFER_PATH
    mkdir $FLATBUFFER_PATH
    cd "$FLATBUFFER_PATH" || exit 1
    
    # OSTYPE is set to the OS on which bash is executing;
    # The default is system-dependent;
    downloadLink=https://github.com/google/flatbuffers/releases/download/${FLATBUFFERS_VERSION}
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
            exit
        ;;
    esac
    
    # download flatc
    curl -L "$downloadLink" -o flatc.zip && unzip flatc.zip && rm flatc.zip
    cd ..
else
    echo "flatc already installed"
fi

rm -rf $SCHEMA_PATH && mkdir  $SCHEMA_PATH

for flatbuffer in $FLATBUFFER_MODELS; do
    chmod +x $FLATC
    ./${FLATC} --rust -o ${SCHEMA_PATH} --include-prefix flatbuffers_generated "$flatbuffer"
    # Generate import from `./flatbuffer_models/flatbuffer_name.fbs`.
    echo "pub mod $(basename "${flatbuffer%.fbs}")_generated;" >> ${SCHEMA_PATH}/mod.rs
done

echo '===> Done!'
