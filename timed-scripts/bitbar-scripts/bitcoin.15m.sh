#!/bin/bash
source $HOME/.aliases
RUNNER="$BITBAR_SRC/crypto.js"
/usr/local/bin/node $RUNNER --accountId $COINBASE_BTC_ACCOUNT_ID \
    --coinbaseApiKey $COINBASE_API_KEY \
    --coinbaseApiSecret $COINBASE_API_SECRET \
    --bigMoneyAmount ${BTC_BIGMONEY} \
    --gdaxApiKey $GDAX_API_KEY \
    --gdaxPassphrase $GDAX_API_PASSPHRASE \
    --gdaxSecret $GDAX_API_SECRET
