const { createReadStream } = require('fs');
const { stdin, stdout, stderr } = require('process');
const { filterHeadLines, createStream } = require('./src/headLib');

const main = function () {
  const [, , filename] = process.argv;
  const createInputStream = function() {
    return stdin;
  };
  const stream = createStream(filename, createReadStream, createInputStream);

  const showResult = function (headOutCome) {
    stderr.write(headOutCome.errMsg);
    stdout.write(headOutCome.headLines);
  };

  filterHeadLines(stream, showResult);
};

main();
