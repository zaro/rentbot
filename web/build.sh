#!/bin/bash

THIS_SCRIPT_DIR=`cd $(dirname $0);pwd`

pushd $THIS_SCRIPT_DIR

rm -fr build/ui
node_modules/.bin/webpack -p

for f in build/ui/*; do
  gzip -9 "$f" -c > "$f.gz"
  touch -r "$f" "$f.gz"
done

popd
