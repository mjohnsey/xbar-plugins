#!/bin/bash
source $HOME/.aliases
RUNNER="$BITBAR_SRC/supervisord-status.js"
/usr/local/bin/node $RUNNER --url "$SENSORLY_INGEST_SUPE_URL" --user "$SENSORLY_INGEST_SUPE_USER" --password "$SENSORLY_INGEST_SUPE_PASSWORD"
