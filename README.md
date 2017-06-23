# Bitbar Plugins
This is where my [Bitbar](https://getbitbar.com/) plugin code lives. You need to symlink the runner/wrapper from `timed_scripts` in your Bitbar plugin folder usually located at `$HOME/bitbar_plugins`.

To install bitbar:
```bash
brew cask install bitbar
```

## Hipchat
This scrapes the Hipchat status page and shows whether `Login`, `Send message`, or `Receive message` functionality is down.

How to run:
```bash
node hipchat.js
```

## Cryptocurrencies
This is a ticker with the current spot price + your wallet balance from Coinbase.

You just need to pass in your account number + your API Key and Secret.

How to run:
```bash
node ./crypto.js --accountId $COINBASE_BTC_ACCOUNT_ID --coinbaseApiKey $COINBASE_API_KEY --coinbaseApiSecret $COINBASE_API_SECRET --bigMoneyAmount 2500.0 --gdaxApiKey $GDAX_API_KEY --gdaxPassphrase $GDAX_API_PASSPHRASE --gdaxSecret $GDAX_API_SECRET
```

## Time
This is a timezone clock with listings for UTC + current team member times.

How to run:
```bash
#!/bin/bash
# OPTIONAL: have to specially source rvm if you are using it
[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"
ruby ./time.rb
```

## Weather
This is straight from   [bitbar-plugins/Weather/ForecastIO](https://github.com/bitbar-plugins/Weather/ForecastIO/weather.15m.py).

Enviroment Varibles Necessary:
```bash
export FORECAST_IO_API_KEY="SECRET"
```

How to run:
```bash
python ./weather.py
```
