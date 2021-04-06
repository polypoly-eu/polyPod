#!/bin/bash

cd Submodules/podigree
echo "\033[1;34mBuilding podigree ...\033[0m"
npm install
npm run build
cp dist/bootstrap.js ../../PolyPodApp/PodApi/pod.js
