const coinbase = require('coinbase');
const https = require('https');
const _ = require('lodash');
const bitbar = require('bitbar');

// uses the bitfinex API http://docs.bitfinex.com/
const baseApiUrl = 'https://api.bitfinex.com/v1';

// const statusUrl = `${baseApiUrl}/stats/BTCUSD`;
const bitcoinSymbol = 'Ƀ';
const ethereumSymbol = 'Ξ';
const bigmoneySymbol = '🤑';
const bigmoneyAmount = 1245.0;

const timeFormat12h = '';
const mmddyyyy = '';

// # Coinbase API - https://www.coinbase.com/settings/api
const coinbaseApiKey = process.env.COINBASE_API_KEY;
const coinbaseApiSecret = process.env.COINBASE_API_SECRET;
const coinbaseAccountId = process.env.COINBASE_ACCOUNT_ID;

if(_.some([coinbaseApiKey, coinbaseApiSecret, coinbaseAccountId], _.isUndefined)){
  console.error('Could not grab ENV! | color=#FF0000');
  return;
}

const client = new coinbase.Client({'apiKey': coinbaseApiKey, 'apiSecret': coinbaseApiSecret});

let printString = '';

const getTickerUrl = function(baseUrl, symbol) {
  // FIXME: add check that symbol in this list
  // ["btcusd","ltcusd","ltcbtc","ethusd","ethbtc","etcbtc","etcusd","rrtusd","rrtbtc","zecusd","zecbtc","xmrusd","xmrbtc","dshusd","dshbtc","bccbtc","bcubtc","bccusd","bcuusd","xrpusd","xrpbtc","iotusd","iotbtc"]
  return `${baseUrl}/pubticker/${symbol}`
};

const tickerUrl = getTickerUrl(baseApiUrl, 'btcusd');
const ethTickerUrl = getTickerUrl(baseApiUrl, 'ethusd');

const handleCoinbaseResponse = function(account, data){
  // { mid: '769.795', bid: '769.79', ask: '769.8', last_price: '769.8', low: '765.0', high: '772.72', volume: '3675.99258378', timestamp: '1481316120.69769026' }
  const responseJson = JSON.parse(data);
  let lastPrice = responseJson.last_price;
  let lastPriceParsed = parseFloat(responseJson.last_price).toFixed(2);
  let currentPrice = `${bitcoinSymbol} ${lastPriceParsed ? lastPriceParsed : lastPrice}`;
  if(lastPriceParsed && lastPriceParsed > bigmoneyAmount){
    currentPrice = `${currentPrice} ${bigmoneySymbol}`
  }
  bitbar([
    {
      text: currentPrice,
    },
    bitbar.sep,
    {text: 'Bitcoin'},
    {text: `Wallet Balance: ${bitcoinSymbol}${account.balance.amount}`},
    {text: `Wallet Balance: \$${account.balance.amount*responseJson.last_price}`},
    bitbar.sep,
    {text: 'Ether'},
    {text: `Wallet Balance: ${ethereumSymbol}${'TODO'}`},
    {text: `Wallet Balance: \$${'TODO'}`},
    bitbar.sep,
    {text: 'Coinbase', href: 'https://coinbase.com'},
    {text: 'Coindesk', href: 'https://coindesk.com'},
    {text: 'Coinigy', href: 'https://www.coinigy.com/main/markets/BITF/BTC/USD'},
  ]);
};

client.getAccount(coinbaseAccountId, function(err, account) {
  https.get(tickerUrl, (res) => {
    res.on('data', (data) => {
      return handleCoinbaseResponse(account, data);
    });

  }).on('error', (err) => {
    console.error(err);
  });
});
