#!/bin/bash
set -e    # Exit if any command fails

echo '===> Compiling the Schema...'

cd flatbuffers_shared
# TODO: Add iOS and Android folders
RUST_FLATBUFFERS_OUT=../src/flatbuffers_generated
FLATBUFFER_MODELS=$( find -P flatbuffer_models -name "*.fbs" )

echo "*** Removing previously compiled models ***"
rm -rf $RUST_FLATBUFFERS_OUT && mkdir $RUST_FLATBUFFERS_OUT

echo "*** Compiling models ***"
for flatbuffer in $FLATBUFFER_MODELS; do
    ./flatc --rust -o ${RUST_FLATBUFFERS_OUT} --include-prefix flatbuffers_generated "$flatbuffer"
    # Generate import from `./flatbuffer_models/flatbuffer_name.fbs`.
    echo "pub mod $(basename "${flatbuffer%.fbs}")_generated;" >> ${RUST_FLATBUFFERS_OUT}/mod.rs

    # TODO: Generate for Swift/Kotlin
done
cd ..

echo '===> Done!'
