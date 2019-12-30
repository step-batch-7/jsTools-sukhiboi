const fs = require('fs');
const { stdin, stdout, stderr } = require('process');
const { filterHeadLines, getInputStream } = require('./src/headLib');

const main = function () {
  const streams = {
    fileReader: fs.createReadStream,
    inputReader: stdin
  };
  const userArgsIndex = 2;
  const userArgs = process.argv.slice(userArgsIndex);
  const inputStream = getInputStream(userArgs, streams);
  filterHeadLines(inputStream, headOutcome => {
    stderr.write(headOutcome.errMsg);
    stdout.write(headOutcome.headLines);
  });
};

main();
