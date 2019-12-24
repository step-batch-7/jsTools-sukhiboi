const { readFileSync, existsSync } = require("fs");

const loadContent = function(read, filenames) {
  const fileExists = existsSync(filenames[0]);
  if (!fileExists) {
    const errMsg = `head: ${filenames[0]}: No such file or directory`;
    return {
      err: true,
      errMsg
    }
  }
  return read(filenames[0], "utf8");
};

const getHeadLines = function(content, lineCount) {
  const lines = content.split("\n");
  const filteredLines = lines.slice(0, lineCount);
  return {
    err: false,
    headLines: filteredLines.join("\n")
  };
};

const filterHeadLines = function(args) {
  const filenames = args.slice(2);
  const content = loadContent(readFileSync, filenames);
  if (content.err) {
    return content;
  }
  return getHeadLines(content, 10);
};

module.exports = {
  filterHeadLines,
  getHeadLines,
  loadContent
};
