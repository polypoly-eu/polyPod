#!/bin/bash
set -e    # Exit if any command fails

echo '===> Compiling the Schema...'

cd flatbuffers_shared
RUST_FLATBUFFERS_OUT=../src/flatbuffers_generated
IOS_FLATBUFFERS_OUT=../PolyPodCoreSwift/Sources/PolyPodCoreSwift/FlatbuffersGenerated
FLATBUFFER_MODELS=$( find -P flatbuffer_models -name "*.fbs" )

echo "*** Removing previously compiled models ***"
rm -rf $RUST_FLATBUFFERS_OUT && mkdir $RUST_FLATBUFFERS_OUT
rm -rf $IOS_FLATBUFFERS_OUT && mkdir $IOS_FLATBUFFERS_OUT

echo "*** Compiling models ***"
for flatbuffer in $FLATBUFFER_MODELS; do
    ./flatc --rust -o ${RUST_FLATBUFFERS_OUT} --include-prefix flatbuffers_generated "$flatbuffer"
    # Generate import from `./flatbuffer_models/flatbuffer_name.fbs`.
    echo "pub mod $(basename "${flatbuffer%.fbs}")_generated;" >> ${RUST_FLATBUFFERS_OUT}/mod.rs

    ./flatc --swift -o ${IOS_FLATBUFFERS_OUT} "$flatbuffer"
done
cd ..

echo '===> Done!'
