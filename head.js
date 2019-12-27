const { stdin, stdout, stderr } = require("process");
const fs = require("fs");
const { filterHeadLines } = require("./src/headLib");

const main = function() {
  filterHeadLines(process.argv, fs.readFile, stdin, headOutcome => {
    stderr.write(headOutcome.errMsg);
    stdout.write(headOutcome.headLines);
  });
};

main();