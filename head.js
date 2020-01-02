const { createReadStream } = require('fs');
const { stdin, stdout, stderr } = require('process');
const { filterHeadLines, createStream } = require('./src/headLib');

const main = function () {
  const [, , filename] = process.argv;
  const inputStream = createStream(filename, createReadStream, stdin);

  const logger = function (headOutCome) {
    stderr.write(headOutCome.errMsg);
    stdout.write(headOutCome.headLines);
  };

  filterHeadLines(inputStream, logger);
};

main();
