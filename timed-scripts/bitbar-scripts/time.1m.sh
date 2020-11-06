#!/bin/bash
source ${HOME}/.aliases
/usr/local/bin/docker run --rm \
    -v ${HOME}/.go-time.toml:/root/.go-time.toml \
    docker.pkg.github.com/mjohnsey/go-time/go-time:amd64-latest
