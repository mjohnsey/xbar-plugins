# Bitbar Plugins
This is where my [Bitbar](https://getbitbar.com/) plugin code lives. You need to symlink the runner/wrapper from `timed_scripts` in your Bitbar plugin folder usually located at `$HOME/bitbar_plugins`.

To install bitbar:
```bash
brew cask install bitbar
```

## Cryptocurrencies
This is a ticker with the current spot price + your wallet balance from Coinbase.

You just need to pass in your account number + your API Key and Secret.

## Time
This is a timezone clock with listings for UTC + current team member times.

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
