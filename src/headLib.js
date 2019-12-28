const loadContent = function(inputStream, returnContent) {
  let lineCount = 1;
  inputStream.on("data", data => {
    if (lineCount == 10) {
      inputStream.pause();
    }
    returnContent(data.toString());
    lineCount++;
  });
  inputStream.on("error", err => {
    returnContent({
      errMsg: `head: ${err.path}: No such file or directory`,
      headLines: ""
    });
  });
};

const getHeadLines = function(content) {
  const lines = content.split("\n");
  const headLines = lines.slice(0, 10);
  return {
    errMsg: "",
    headLines: headLines.join("\n")
  };
};

const filterHeadLines = function(inputStream, writer) {
  loadContent(inputStream, content => {
    if (content.errMsg) {
      writer(content);
      return;
    }
    const headLines = getHeadLines(content);
    writer(headLines);
  });
};

const getInputStream = function(filenames, streams) {
  if (filenames.length == 0) {
    return streams.inputReader;
  }
  return streams.fileReader(filenames[0]);
};

module.exports = {
  filterHeadLines,
  getHeadLines,
  loadContent,
  getInputStream
};
