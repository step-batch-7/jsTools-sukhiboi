const { readFileSync, existsSync } = require("fs");

const generateHeadReport = function(isErr, para, stream) {
  return {
    isErr,
    para,
    stream
  };
};

const loadContent = function(read, filenames) {
  const fileExists = existsSync(filenames[0]);
  if (!fileExists) {
    const errMsg = `head: ${filenames[0]}: No such file or directory`;
    return generateHeadReport(true, errMsg, console.error);
  }
  return read(filenames[0], "utf8");
};

const getHeadLines = function(content, lineCount) {
  if (content.isErr) {
    return content;
  }
  const lines = content.split("\n");
  const filteredLines = lines.slice(0, lineCount);
  return generateHeadReport(false, filteredLines.join("\n"), console.log);
};

const performHead = function(args) {
  const filenames = args.slice(2);
  const content = loadContent(readFileSync, filenames);
  return getHeadLines(content, 10);
};

module.exports = {
  performHead,
  getHeadLines,
  loadContent,
  generateHeadReport
};
