#!/bin/bash
source ${HOME}/.aliases
/usr/local/bin/docker run --rm \
    -v ${HOME}/.config/go-time/go-time.toml:/root/.go-time.toml \
    ghcr.io/mjohnsey/go-time/go-time:latest
