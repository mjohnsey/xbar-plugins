/* eslint no-console: ["error", { allow: ["error"] }] */
const coinbase = require('coinbase');
const _ = require('lodash');
const bitbar = require('bitbar');
const rp = require('request-promise-native');
const { promisify } = require('util');

const bitcoinSymbol = 'Ƀ';
const ethereumSymbol = 'Ξ';

const getTickerUrl = function getTickerUrl(baseUrl, symbol) {
  // FIXME: add check that symbol in this list
  // ["btcusd","ltcusd","ltcbtc","ethusd","ethbtc","etcbtc","etcusd","rrtusd",
  // "rrtbtc","zecusd","zecbtc","xmrusd","xmrbtc","dshusd","dshbtc","bccbtc",
  // "bcubtc","bccusd","bcuusd","xrpusd","xrpbtc","iotusd","iotbtc"]
  return `${baseUrl}/pubticker/${symbol}`;
};

const parseLastPrice = function parseLastPrice(data) {
  // { mid: '769.795', bid: '769.79', ask: '769.8', last_price: '769.8',
  // low: '765.0', high: '772.72', volume: '3675.99258378', timestamp: '1481316120.69769026' }
  const responseJson = JSON.parse(data);
  const lastPrice = responseJson.last_price;
  return lastPrice;
};

const prettyPrintLastPrice = function prettyPrintLastPrice(symbol, lastPrice, bigMoneyAmount, bigMoneySymbol = '🤑') {
  const lastPriceRounded = parseFloat(lastPrice).toFixed(2);
  const currentPrice = `${symbol} ${lastPriceRounded || lastPrice}${lastPriceRounded > bigMoneyAmount ? `${bigMoneySymbol}` : ''}`;
  return currentPrice;
};

const parseCoinbaseAccount = function parseCoinbaseAccount(account, symbol, lastPrice) {
  const result = {};
  const accountBalance = account.balance.amount;
  result.cryptoBalance = `${symbol}${accountBalance}`;
  result.usdBalance = `$${accountBalance * lastPrice}`;
  return result;
};

const main = async function main() {
  const bigmoneyAmount = 2400.0; // FIXME: add as arg variable
  const cryptoType = 'btcusd'; // FIXME: add as arg variable
  // uses the bitfinex API http://docs.bitfinex.com/
  const baseApiUrl = 'https://api.bitfinex.com/v1';

  // # Coinbase API - https://www.coinbase.com/settings/api
  const coinbaseApiKey = process.env.COINBASE_API_KEY; // FIXME: add as arg variable
  const coinbaseApiSecret = process.env.COINBASE_API_SECRET; // FIXME: add as arg variable
  const coinbaseBtcAccountId = process.env.COINBASE_ACCOUNT_ID; // FIXME: add as arg variable

  if (_.some([coinbaseApiKey, coinbaseApiSecret, coinbaseBtcAccountId], _.isUndefined)) {
    throw new Error('Could not grab ENV!');
  }
  const client = new coinbase.Client({ apiKey: coinbaseApiKey, apiSecret: coinbaseApiSecret });
  const promisifiedGetAccount = promisify(client.getAccount.bind(client));
  const btcAccount = await promisifiedGetAccount(coinbaseBtcAccountId);
  const tickerUrl = getTickerUrl(baseApiUrl, cryptoType);
  // const ethTickerUrl = getTickerUrl(baseApiUrl, 'ethusd');
  const options = {
    method: 'GET',
    uri: tickerUrl,
    resolveWithFullResponse: true,
  };
  //
  const res = await rp(options);
  const data = res.body;
  const lastPrice = parseLastPrice(data);
  const currentPrice = prettyPrintLastPrice(bitcoinSymbol, lastPrice, bigmoneyAmount);
  const parsedAccount = parseCoinbaseAccount(btcAccount, bitcoinSymbol, lastPrice);
  bitbar([
    {
      text: currentPrice,
    },
    bitbar.sep,
    { text: 'Bitcoin' },
    { text: `Wallet Balance: ${parsedAccount.cryptoBalance}` },
    { text: `Wallet Balance: ${parsedAccount.usdBalance}` },
    bitbar.sep,
    { text: 'Ether' },
    { text: `Wallet Balance: ${ethereumSymbol}${'TODO'}` },
    { text: `Wallet Balance: $${'TODO'}` },
    bitbar.sep,
    { text: 'Coinbase', href: 'https://coinbase.com' },
    { text: 'Coindesk', href: 'https://coindesk.com' },
    { text: 'GDAX', href: 'https://www.gdax.com/trade/BTC-USD' },
  ]);
};

try {
  main();
} catch (err) {
  console.error(err);
}
