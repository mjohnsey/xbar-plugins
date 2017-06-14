const http = require('https');
const _ = require('lodash');

const upIcon = '👌';
const downIcon = 'Hipchat - 🔴';
const statusUrl = 'https://status.hipchat.com/';
const separatorAndLink = `---\n🚦Status Page|href=${statusUrl}`;
const statusApi = 'https://79qy3nj6i7.execute-api.us-west-2.amazonaws.com/api/components';

let printString = '';

const addLine = function(line){
  if(printString != ''){
    printString += '\n'
  }
  printString += `${line}\n`
};

const parseResult = function(data){
  const components = JSON.parse(data);
  const ppComponents = [];
  let alive = true;
  for(let i=0;i<components.length;i++){
    const component = components[i];
    const name = component.name;
    const status = component.status;
    if(!status == 'operational'){
      alive = false;
    }
    const pp = `${name} - ${status.toUpperCase()}`
    ppComponents.push(pp);
  }
  const statusSymbol = alive ? upIcon : downIcon;
  addLine(statusSymbol);
  addLine(separatorAndLink);
  _.map(ppComponents, (comp) => addLine(comp));
};

http.get(statusApi, function(res){
  res.on('data', function(data){
    parseResult(data);
    console.log(printString);
  });
});
