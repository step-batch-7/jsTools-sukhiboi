const fs = require('fs');
const { stdin, stdout, stderr } = require('process');
const { filterHeadLines, getInputStream } = require('./src/headLib');

const main = function () {
  const [, , filename] = process.argv;
  const inputStream = getInputStream(filename, fs.createReadStream, stdin);
  filterHeadLines(inputStream, headOutcome => {
    stderr.write(headOutcome.errMsg);
    stdout.write(headOutcome.headLines);
  });
};

main();
