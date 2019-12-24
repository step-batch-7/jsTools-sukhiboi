const { filterHeadLines } = require("./src/headLib");

const main = function() {
  const args = process.argv;
  const streamTypes = {
    error: console.error,
    output: console.log
  };
  const result = filterHeadLines(args);
  const stream = streamTypes[result.type];
  stream(result.para);
};

main();
