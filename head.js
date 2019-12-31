const fs = require('fs');
const { stdin, stdout, stderr } = require('process');
const { filterHeadLines, getInputStream } = require('./src/headLib');

const main = function () {
  const userArgsIndex = 2;
  const userArgs = process.argv.slice(userArgsIndex);
  const inputStream = getInputStream(userArgs, fs.createReadStream, stdin);
  filterHeadLines(inputStream, headOutcome => {
    stderr.write(headOutcome.errMsg);
    stdout.write(headOutcome.headLines);
  });
};

main();
