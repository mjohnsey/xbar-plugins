#!/bin/bash
source $HOME/.aliases
RUNNER="$BITBAR_SRC/crypto.js"
BIGMONEY=450.0
node $RUNNER --accountId $COINBASE_ETH_ACCOUNT_ID --coinbaseApiKey $COINBASE_API_KEY --coinbaseApiSecret $COINBASE_API_SECRET --bigMoneyAmount $BIGMONEY --gdaxApiKey $GDAX_API_KEY --gdaxPassphrase $GDAX_API_PASSPHRASE --gdaxSecret $GDAX_API_SECRET
