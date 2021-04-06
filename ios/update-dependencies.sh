#!/bin/bash

echo "\033[1;34mUpdating submodules ...\033[0m"
git submodule update --remote
sh update-bootstrap.sh
sh update-features.sh
