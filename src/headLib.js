const loadContent = function(read, exists, filenames) {
  const fileExists = exists(filenames[0]);
  if (!fileExists) {
    const errMsg = `head: ${filenames[0]}: No such file or directory`;
    return {
      errMsg,
      headLines: ""
    };
  }
  return read(filenames[0], "utf8");
};

const getHeadLines = function(content, lineCount) {
  const lines = content.split("\n");
  const headLines = lines.slice(0, lineCount);
  return {
    errMsg: "",
    headLines: headLines.join("\n")
  };
};

const filterHeadLines = function(args, fs) {
  const filenames = args.slice(2);
  const content = loadContent(fs.readFileSync, fs.existsSync, filenames);
  if (content.errMsg) {
    return content;
  }
  return getHeadLines(content, 10);
};

module.exports = {
  filterHeadLines,
  getHeadLines,
  loadContent
};
