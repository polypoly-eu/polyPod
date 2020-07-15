#!/bin/bash

echo "\033[1;34mUpdating submodules ...\033[0m"
git submodule update --remote
cd Features
for D in */; do
    cd $D
    FEATURE_NAME="$(basename $(pwd))"
    echo "\033[1;34mBuilding feature $FEATURE_NAME ...\033[0m"
    npm install
    npm run build
    echo "\033[1;34mMove feature to Xcode project\033[0m"
    cd dist
    zip -r ../$FEATURE_NAME.zip .
    cd ..
    mv $FEATURE_NAME.zip ../../PolyPodApp/Features/$FEATURE_NAME
    cd ..
done
