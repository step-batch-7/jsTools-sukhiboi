const { filterHeadLines } = require("./src/headLib");
const fs = require("fs");

const main = function() {
  const headOutcome = filterHeadLines(process.argv, fs);
  process.stderr.write(headOutcome.errMsg);
  process.stdout.write(headOutcome.headLines);
};

main();