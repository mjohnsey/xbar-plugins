/* eslint no-console: ["error", { allow: ["error","log"] }] */
const _ = require('lodash');
const bitbar = require('bitbar');
const rp = require('request-promise-native');
const minimist = require('minimist');
const time = require('time');

const workerStatsWebsite = function workerStatsWebsite(workerAddress) {
  return `https://www.alpereum.ch/worker/?address=${workerAddress}`;
};

const workerStatsApiAddress = function workerStatsApiAddress(workerAddress) {
  return `https://eiger.alpereum.net/api/miner_stats?address=${workerAddress}`;
};

const parseWorkerStats = function parseWorkerStats(data) {
  // { time: 1498232166000,
  // hashrate: 13333333,
  // staleHashrate: 0,
  // submittedHashrate: -1,
  // workers: 1 }
  const lastFew = _.takeRight(data, 3);
  const lastUpdate = _.takeRight(lastFew)[0];
  const lastUpdateTs = new time.Date(lastUpdate.time);
  const amIUp = lastUpdate.workers > 0;
  const avgHashRate = _.mean(_.map(lastFew, 'hashrate'));
  console.log(lastUpdate);
  console.log(`lastUpdateTs: ${lastUpdateTs}`);
  console.log(`amIUp: ${amIUp}`);
  console.log(`avgHashRate: ${avgHashRate}`);
};

const workerStatApiRequest = async function workerStatApiRequest(workerAddress) {
  const workerApiAddress = workerStatsApiAddress(workerAddress);
  const data = await rp(workerApiAddress);
  return JSON.parse(data);
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

  const data = await workerStatApiRequest(workerAddress);
  parseWorkerStats(data);

  bitbar([
    {
      text: 'alpereum',
    },
    bitbar.sep,
    { text: 'Worker Stats', href: workerStatsWebsite(workerAddress) },
  ]);
}

main().catch((e) => {
  console.error(e);
});
