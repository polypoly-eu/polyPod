#!/bin/bash

echo "Packaging polyPod API ..."
cp ../core/podigree/dist/bootstrap.js PolyPodApp/PodApi/pod.js

FEATURES_TARGET_PATH="$(pwd)/PolyPodApp/Features"
mkdir -p "$FEATURES_TARGET_PATH"

FEATURES="polyExplorer polyPreview"
for FEATURE in $FEATURES; do
    echo "Packaging feature $FEATURE ..."
    pushd "../features/$FEATURE/dist" >/dev/null
    FEATURE_TARGET_PATH="$FEATURES_TARGET_PATH/$FEATURE.zip"
    rm -f "$FEATURE_TARGET_PATH"
    zip -rq "$FEATURE_TARGET_PATH" .
    popd >/dev/null
done
