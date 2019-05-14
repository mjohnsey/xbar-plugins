#!/bin/bash
source $HOME/.aliases
RUNNER="$BITBAR_SRC/crypto.js"
node $RUNNER --accountId $COINBASE_ETH_ACCOUNT_ID \
    --coinbaseApiKey $COINBASE_API_KEY \
    --coinbaseApiSecret $COINBASE_API_SECRET \
    --bigMoneyAmount ${ETH_BIGMONEY} \
    --gdaxApiKey $GDAX_API_KEY \
    --gdaxPassphrase $GDAX_API_PASSPHRASE \
    --gdaxSecret $GDAX_API_SECRET
