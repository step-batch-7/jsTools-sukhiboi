const { performHead } = require("./src/headLib");

const main = function() {
  const args = process.argv;
  const result = performHead(args);
  result.stream(result.para);
};

main();
