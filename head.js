const { filterHeadLines } = require("./src/headLib");

const main = function() {
  const args = process.argv;
  const {err, errMsg, headLines} = filterHeadLines(args);
  err && console.error(errMsg);
  !err && console.log(headLines)
};

main();
