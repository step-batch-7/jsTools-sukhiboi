const generateErrorMsg = function (err) {
  return `head: ${err.path}: No such file or directory`;
};

const formatContent = function (errMsg, lines) {
  return {
    errMsg,
    lines
  };
};

const loadContent = function (inputStream, onLoadComplete) {
  let lineCount = 0;
  const defaultLineCount = 9;

  inputStream.on('data', data => {
    if (lineCount === defaultLineCount) {
      inputStream.destroy();
    }
    lineCount++;
    const content = formatContent('', data.toString());
    onLoadComplete(content);
  });

  inputStream.on('error', err => {
    inputStream.destroy();
    const errMsg = generateErrorMsg(err);
    const content = formatContent(errMsg, '');
    onLoadComplete(content);
  });
};

const getHeadLines = function (content) {
  const lines = content.split('\n');
  const firstIndex = 0, eleventhIndex = 10;
  const headLines = lines.slice(firstIndex, eleventhIndex);
  return headLines.join('\n');
};

const filterHeadLines = function (inputStream, writer) {
  const contentHandler = function (content) {
    const headOutcome = {
      errMsg: content.errMsg,
      headLines: getHeadLines(content.lines)
    };
    writer(headOutcome);
  };
  loadContent(inputStream, contentHandler);
};

const createStream = function (filename, fileStream, inputStream) {
  return filename ? fileStream(filename) : inputStream;
};

module.exports = {
  filterHeadLines,
  getHeadLines,
  loadContent,
  createStream
};
