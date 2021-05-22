#!/bin/bash
source ${HOME}/.aliases
/usr/local/bin/docker run --rm \
    -v ${HOME}/.config/coin-check/config.toml:/root/.config/coin-check/config.toml \
    docker.pkg.github.com/mjohnsey/coin-check/coin-check:latest price ETH -f bitbar