const { existsSync } = require("fs");

const getLineCount = function() {
  const defaultLineCount = 10;
  return defaultLineCount;
};

const filterFilenames = function(args) {
  return args.slice(2);
};

const loadContent = function(reader, filenames) {
  const fileExists = existsSync(filenames[0]);
  if (!fileExists) {
    throw new Error(`head: ${filenames[0]}: No such file or directory`);
  }
  return reader(filenames[0], "utf8");
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
