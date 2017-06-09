#!/bin/bash

THIS_SCRIPT_DIR=`cd $(dirname $0);pwd`

pushd $THIS_SCRIPT_DIR

rm -fr build
node_modules/.bin/webpack -p

popd
