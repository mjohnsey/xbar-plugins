/* eslint no-console: ["error", { allow: ["error"] }] */
const coinbase = require('coinbase');
const _ = require('lodash');
const bitbar = require('bitbar');
const { promisify } = require('util');
const minimist = require('minimist');

const prettyPrintCurrentPrice = function prettyPrintCurrentPrice(price, cryptoSymbol, bigMoneyAmt, bigMoneySymbol = '🤑') {
  const lastPriceRounded = parseFloat(price).toFixed(2);
  const currentPrice = `${cryptoSymbol} ${lastPriceRounded || price}${lastPriceRounded > bigMoneyAmt ? `${bigMoneySymbol}` : ''}`;
  return currentPrice;
};

const parseCoinbaseAccount = function parseCoinbaseAccount(account) {
  if (_.isUndefined([account])) {
    throw new Error('Do not recognize this Coinbase account format!');
  }
  const cryptoTypes = [];
  cryptoTypes.push({ symbol: 'Ƀ', name: 'BTC' });
  cryptoTypes.push({ symbol: 'Ł', name: 'LTC' });
  cryptoTypes.push({ symbol: 'Ξ', name: 'ETH' });
  const result = {};
  const accountBalance = account.balance.amount;
  const accountNativeBalance = account.native_balance.amount;
  const cryptoType = _.find(cryptoTypes, t => t.name === account.currency);
  result.currency = account.currency;
  result.symbol = !_.isUndefined(cryptoType) ? cryptoType.symbol : null;
  result.cryptoBalance = accountBalance;
  result.usdBalance = accountNativeBalance;
  return result;
};

const getCurrentSpotPrice = async function getCurrentSpotPrice(coinbaseClient, currencyPair) {
  const promisifiedGetSpotPrice = promisify(coinbaseClient.getSpotPrice.bind(coinbaseClient));
  const spotPrice = await promisifiedGetSpotPrice({ currencyPair });
  return spotPrice.data.amount;
};

const getCurrencyPair = function getCurrencyPair(currency, converted = 'USD') {
  return `${currency}-${converted}`;
};

const main = async function main() {
  const args = minimist(process.argv.slice(2));
  const requiredArgs = ['accountId', 'coinbaseApiKey', 'coinbaseApiSecret', 'bigMoneyAmount'];
  _.each(requiredArgs, (a) => {
    if (!(a in args)) {
      throw new Error(`Missing arg - ${a}`);
    }
  });
  const bigMoneyAmount = args.bigMoneyAmount;
  const accountId = args.accountId;
  const coinbaseApiKey = args.coinbaseApiKey;
  const coinbaseApiSecret = args.coinbaseApiSecret;

  const client = new coinbase.Client({ apiKey: coinbaseApiKey, apiSecret: coinbaseApiSecret });
  const promisifiedGetAccount = promisify(client.getAccount.bind(client));

  const account = await promisifiedGetAccount(accountId);
  const parsedAccount = parseCoinbaseAccount(account);
  const currencyPair = getCurrencyPair(parsedAccount.currency);
  const currentPrice = await getCurrentSpotPrice(client, currencyPair);
  const ppCurrentPrice = prettyPrintCurrentPrice(currentPrice,
    parsedAccount.symbol,
    bigMoneyAmount);

  bitbar([
    {
      text: ppCurrentPrice,
    },
    bitbar.sep,
    { text: parsedAccount.currency },
    { text: `Wallet Balance: ${parsedAccount.symbol} ${parsedAccount.cryptoBalance}` },
    { text: `Wallet Balance: $${parsedAccount.usdBalance}` },
    bitbar.sep,
    { text: 'Coinbase', href: 'https://coinbase.com' },
    { text: 'GDAX', href: `https://www.gdax.com/trade/${currencyPair}` },
  ]);
};

main().catch((e) => {
  console.error(e);
});
