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
  const tds = $(row).find('td');
  const processStatus = $(tds[0]).text();
  const processName = $(tds[2]).text();
  const isRunning = _.lowerCase(processStatus) === 'running';
  return { status: processStatus, name: processName, isRunning };
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
  const pp = _.map(supes, supe => `${supe.name} - ${supe.status}`);
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
