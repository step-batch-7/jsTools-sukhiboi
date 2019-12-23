const { existsSync } = require("fs");

const getLineCount = function(args) {
  const defaultLineCount = 10;
  const lineCount = parseInt(args[3]);
  const isValidOption = args[2] == "-n";
  const isValidLineCount = Number.isInteger(lineCount) && lineCount > 0;
  if (isValidOption) {
    if (isValidLineCount) {
      return lineCount;
    }
    throw new Error(`head: illegal line count -- ${args[3]}`);
  }
  return defaultLineCount;
};

const filterFilenames = function(args) {
  if (args[2] == "-n") {
    return args.slice(4);
  }
  return args.slice(2);
};

const loadContent = function(reader, filenames) {
  const fileExists = existsSync(filenames[0]);
  if (fileExists) {
    return reader(filenames[0], "utf8");
  }
  throw new Error(`head: ${filenames[0]}: No such file or directory`);
};

const filterLines = function(content, lineCount) {
  const lines = content.split("\n");
  const filteredLines = lines.slice(0, lineCount);
  const result = filteredLines.join("\n");
  return result;
};

module.exports = {
  getLineCount,
  filterFilenames,
  loadContent,
  filterLines
};
