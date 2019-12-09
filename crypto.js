/* eslint no-console: ["error", { allow: ["error"] }] */
const _ = require('lodash');
const bitbar = require('bitbar');
const minimist = require('minimist');
const Gdax = require('coinbase-pro');

const roundMoney = function roundMoney(moneyAmt, decimalPlaces = 2) {
  const rounded = parseFloat(moneyAmt).toFixed(decimalPlaces);
  return rounded || moneyAmt;
};

const prettyPrintCurrentPrice = function prettyPrintCurrentPrice(price, cryptoSymbol, bigMoneyAmt, bigMoneySymbol = '🤑') {
  const lastPriceRounded = roundMoney(price);
  const currentPrice = `${cryptoSymbol} ${lastPriceRounded}${lastPriceRounded > bigMoneyAmt ? `${bigMoneySymbol}` : ''}`;
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
  const accountBalance = account.balance;
  const cryptoType = _.find(cryptoTypes, t => t.name === account.currency);
  result.currency = account.currency;
  result.symbol = !_.isUndefined(cryptoType) ? cryptoType.symbol : null;
  result.cryptoBalance = accountBalance;
  return result;
};

const getCurrentSpotPrice = async function getCurrentSpotPrice(coinbaseClient, currencyPair) {
  const ticker = await coinbaseClient.getProductTicker(currencyPair);
  return ticker.price;
};

const getCurrencyPair = function getCurrencyPair(currency, converted = 'USD') {
  return `${currency}-${converted}`;
};

const main = async function main() {
  const args = minimist(process.argv.slice(2));
  const requiredArgs = ['accountId', 'coinbaseApiKey', 'coinbaseApiSecret', 'gdaxApiKey', 'gdaxPassphrase', 'gdaxSecret', 'bigMoneyAmount'];
  _.each(requiredArgs, (a) => {
    if (!(a in args)) {
      throw new Error(`Missing arg - ${a}`);
    }
  });
  const bigMoneyAmount = args.bigMoneyAmount;
  const accountId = args.accountId;

  const gdaxApiKey = args.gdaxApiKey;
  const gdaxPassphrase = args.gdaxPassphrase;
  const gdaxSecret = args.gdaxSecret;

  const authedClient = new Gdax.AuthenticatedClient(gdaxApiKey, gdaxSecret, gdaxPassphrase);

  const coinbaseAccounts = await authedClient.getCoinbaseAccounts();
  const account = _.first(_.filter(coinbaseAccounts, acct => acct.id === accountId));
  const parsedAccount = parseCoinbaseAccount(account);
  const currencyPair = getCurrencyPair(parsedAccount.currency);
  const currentPrice = await getCurrentSpotPrice(authedClient, currencyPair);
  parsedAccount.usdBalance = currentPrice * parsedAccount.cryptoBalance;
  const ppCurrentPrice = prettyPrintCurrentPrice(currentPrice,
    parsedAccount.symbol,
    bigMoneyAmount);

  bitbar([
    {
      text: ppCurrentPrice,
    },
    bitbar.separator,
    { text: parsedAccount.currency },
    { text: `Wallet Balance: ${parsedAccount.symbol} ${parsedAccount.cryptoBalance}` },
    { text: `Wallet Balance: $${parsedAccount.usdBalance}` },
    bitbar.separator,
    { text: 'Coinbase', href: 'https://coinbase.com' },
  ]);
};

main().catch((e) => {
  console.error(e);
});
