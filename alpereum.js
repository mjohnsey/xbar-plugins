/* eslint no-console: ["error", { allow: ["error","log"] }] */
const _ = require('lodash');
const bitbar = require('bitbar');
const rp = require('request-promise-native');
const minimist = require('minimist');
const time = require('time');

const upIcon = '✅';
const downIcon = 'Alpereum - 🔴';
const etherSymbol = 'Ξ';

const workerStatsWebsite = function workerStatsWebsite(workerAddress) {
  return `https://www.alpereum.ch/worker/?address=${workerAddress}`;
};

const workerStatsApiAddress = function workerStatsApiAddress(workerAddress) {
  return `https://eiger.alpereum.net/api/miner_stats?address=${workerAddress}`;
};

const workerPayoutAddress = function workerPayoutAddress(workerAddress) {
  return `https://eiger.alpereum.net/api/balance?address=${workerAddress}`;
};

const parseWorkerStats = function parseWorkerStats(data, numberOfSamples = 10) {
  // { time: 1498232166000,hashrate: 13333333, staleHashrate: 0, submittedHashrate: -1, workers: 1 }
  const samples = _.takeRight(data, numberOfSamples);
  const lastUpdate = _.takeRight(samples)[0];
  const lastUpdateTs = new time.Date(lastUpdate.time);
  const amIUp = lastUpdate.workers > 0;
  const avgHashRate = _.mean(_.map(samples, 'hashrate'));
  return { amIUp, lastUpdateTs, avgHashRate };
};

const parseWorkerPayout = function parseWorkerPayout(data) {
  const balances = data.balances;
  const eth = _.find(balances, b => b.coin === 'ether');
  const ethBalance = eth.balance;
  return { ethBalance };
};

const workerPayoutApiRequest = async function workerPayoutApiRequest(workerAddress) {
  const workerApiAddress = workerPayoutAddress(workerAddress);
  const data = await rp(workerApiAddress);
  return JSON.parse(data);
};

const workerStatApiRequest = async function workerStatApiRequest(workerAddress) {
  const workerApiAddress = workerStatsApiAddress(workerAddress);
  const data = await rp(workerApiAddress);
  return JSON.parse(data);
};

const parseMHS = function parseMHS(avgHash, decimalPlaces = 2) {
  const mhs = avgHash / 1000000;
  return mhs.toFixed(decimalPlaces);
};

const main = async function main() {
  const args = minimist(process.argv.slice(2), { string: 'workerAddress' });
  const requiredArgs = ['workerAddress'];
  _.each(requiredArgs, (a) => {
    if (!(a in args)) {
      throw new Error(`Missing arg - ${a}`);
    }
  });

  const workerAddress = args.workerAddress;

  const statData = await workerStatApiRequest(workerAddress);
  const stats = parseWorkerStats(statData);
  const payoutData = await workerPayoutApiRequest(workerAddress);
  const payout = parseWorkerPayout(payoutData);
  const avgHashMHS = parseMHS(stats.avgHashRate);

  const up = stats.amIUp;
  const lastUpdate = stats.lastUpdateTs;
  const avgHashRate = stats.avgHashRate;
  const etherPayout = payout.ethBalance;

  const upText = up ? upIcon : downIcon;

  bitbar([
    {
      text: upText,
    },
    bitbar.sep,
    { text: `Avg Hashrate: ${avgHashMHS} MH/S (${avgHashRate})` },
    { text: `Current Balance: ${etherSymbol}${etherPayout}` },
    { text: `Last Update: ${lastUpdate}` },
    bitbar.sep,
    { text: 'Worker Stats', href: workerStatsWebsite(workerAddress) },
  ]);
};

main().catch((e) => {
  bitbar([
    {
      text: downIcon,
    },
    bitbar.sep,
    { text: e },
  ]);
  console.error(e);
});
