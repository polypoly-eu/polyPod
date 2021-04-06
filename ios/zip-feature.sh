#!/bin/bash

cd Submodules/Features
D=$1
cd $D
FEATURE_NAME="$(basename $(pwd))"
cd dist
zip -r ../$FEATURE_NAME.zip .
cd ..
mv $FEATURE_NAME.zip ../../../PolyPodApp/Features/$FEATURE_NAME
