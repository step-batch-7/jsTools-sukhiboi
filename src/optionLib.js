const getLineCount = function(args) {
  const defaultLineCount = 10;
  const lineCount = parseInt(args[3]);
  const isValidOption = args[2] == "-n";
  const isValidLineCount = Number.isInteger(lineCount) && lineCount > 0;
  if (isValidOption && isValidLineCount) {
    return lineCount;
  }
  return defaultLineCount;
};

const filterFilenames = function(args) {
  if(args[2] == "-n"){
    return args.slice(4);
  }
  return args.slice(2)
};

module.exports = {
  getLineCount,
  filterFilenames
};
