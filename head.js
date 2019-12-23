const { performHead } = require("./src/headLib");

const main = function() {
  const args = process.argv;
  const streamType = {
    error: console.error,
    output: console.log
  }
  const result = performHead(args);
  const stream = streamType[result.type];
  stream(result.para)
};

main();
