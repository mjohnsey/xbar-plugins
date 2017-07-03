/* eslint no-console: ["error", { allow: ["error","log"] }] */
const _ = require('lodash');
const bitbar = require('bitbar');
const rp = require('request-promise-native');
const minimist = require('minimist'); // USED for the CLI
const cheerio = require('cheerio');

const upIcon = '✅';
const downIcon = 'Ingest - 🔴';

const getSupePage = async function getSupePage(url, username, password) {
  const authBuff = new Buffer(`${username}:${password}`).toString('base64');
  const authorization = `Basic ${authBuff}`;

  const headers = { authorization };

  const options = {
    uri: url,
    headers,
  };

  const data = await rp(url, options);
  return data;
};

const parseSupeRow = function processSupeRow($, row) {
  const result = {};
  const tds = $(row).find('td');
  const processStatus = $(tds[0]).text();
  result.status = processStatus;
  const processName = $(tds[2]).text();
  result.name = processName;
  const isRunning = _.lowerCase(processStatus) === 'running';
  result.isRunning = isRunning;
  const processDetails = $(tds[1]).text();
  if (isRunning) {
    const splits = _.split(processDetails, ', ');
    const fullUptime = splits[1];
    const uptime = fullUptime.replace('uptime ', '');
    result.uptime = uptime;
  } else {
    const downSince = `${processDetails} UTC`;
    result.downSince = downSince;
  }
  return result;
};

const parseSupePage = function parseSupePage(body) {
  const $ = cheerio.load(body);
  const allRows = $('table').find('tr');
  const processRows = _.takeRight(allRows, 2);
  const supes = [];
  _.each(processRows, (row) => {
    const supeRow = parseSupeRow($, row);
    supes.push(supeRow);
  });
  return supes;
};

const prettyPrintSupes = function prettyPrintSupes(supes) {
  const pp = _.map(supes, (supe) => {
    let base = `${supe.name} - ${supe.status}`;
    if (supe.isRunning) {
      base = `${base}(${supe.uptime})`;
    } else {
      base = `${base}(${supe.downSince})`;
    }
    return base;
  });
  return _.join(pp, '\n');
};

const main = async function main() {
  const args = minimist(process.argv.slice(2), { string: ['url', 'user', 'password'] });
  const requiredArgs = ['url', 'user', 'password'];
  _.each(requiredArgs, (a) => {
    if (!(a in args)) {
      throw new Error(`Missing arg - ${a}`);
    }
  });
  const url = args.url;
  const username = args.user;
  const password = args.password;
  const body = await getSupePage(url, username, password);
  const supes = parseSupePage(body);
  const allRunning = _.every(supes, 'isRunning');

  const statusIcon = allRunning ? upIcon : downIcon;
  const ppSupes = prettyPrintSupes(supes);

  bitbar([
    {
      text: statusIcon,
    },
    bitbar.sep,
    { text: ppSupes },
    bitbar.sep,
    { text: 'Supervisor Dashboard', href: url },
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
});
