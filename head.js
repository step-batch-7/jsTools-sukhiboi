const { filterHeadLines } = require("./src/headLib");
const {readFileSync, existsSync,} = require("fs");

const main = function() {
  const ioTools = {
    reader: readFileSync,
    exists: existsSync
  }
  const { err, errMsg, headLines } = filterHeadLines(process.argv, ioTools);
  err && console.error(errMsg);
  !err && console.log(headLines);
};

main();