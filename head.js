const { filterHeadLines } = require("./src/headLib");

const main = function() {
  const { err, errMsg, headLines } = filterHeadLines(process.argv);
  err && console.error(errMsg);
  !err && console.log(headLines);
};

main();
