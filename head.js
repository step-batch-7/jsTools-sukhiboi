const fs = require('fs');
const { stdin, stdout, stderr } = require('process');
const { filterHeadLines, getInputStream } = require('./src/headLib');

const main = function () {
  const [, , filename] = process.argv;
  const inputStream = getInputStream(filename, fs.createReadStream, stdin);
  
  const logger = function (headOutCome) {
    stderr.write(headOutCome.errMsg);
    stdout.write(headOutCome.headLines);
  };

  filterHeadLines(inputStream, logger);
};

main();
