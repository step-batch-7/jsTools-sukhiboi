const { stdin, stdout, stderr } = require("process");
const fs = require("fs");
const { filterHeadLines, getInputStream } = require("./src/headLib");

const main = function() {
  const streams = {
    fileReader: fs.createReadStream,
    inputReader: stdin
  };
  const inputStream = getInputStream(process.argv.slice(2), streams);
  filterHeadLines(inputStream, headOutcome => {
    stderr.write(headOutcome.errMsg);
    stdout.write(headOutcome.headLines);
  });
};

main();
