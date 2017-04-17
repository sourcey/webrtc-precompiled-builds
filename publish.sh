#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

node manifest
git add -A
git commit -m "Update build"
git push origin master

echo Build published
