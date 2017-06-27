#!/bin/bash
source $HOME/.aliases
RUNNER="$BITBAR_SRC/alpereum.js"
WORKER_ADDRESS=$ALPEREUM_ADDRESS
node $RUNNER --workerAddress "$WORKER_ADDRESS"
