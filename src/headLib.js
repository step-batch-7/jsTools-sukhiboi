const generateErrorMsg = function (err) {
  return `head: ${err.path}: No such file or directory`;
};

const formatContent = function (errMsg, lines) {
  return { errMsg, lines };
};

const loadContent = function (stream, onLoadComplete) {
  let lineCount = 0;
  const defaultLineCount = 9;

  stream.on('data', data => {
    if (lineCount === defaultLineCount) {
      stream.destroy();
    }
    const content = formatContent('', data.toString());
    onLoadComplete(content);
    lineCount++;
  });

  stream.on('error', err => {
    const errMsg = generateErrorMsg(err);
    const content = formatContent(errMsg, '');
    onLoadComplete(content);
  });
};

const getHeadLines = function (content) {
  const lines = content.split('\n');
  const firstIndex = 0, lineCount = 10;
  const headLines = lines.slice(firstIndex, lineCount);
  return headLines.join('\n');
};

const filterHeadLines = function (stream, showResult) {
  const contentHandler = function (content) {
    const headOutcome = {
      errMsg: content.errMsg,
      headLines: getHeadLines(content.lines)
    };
    showResult(headOutcome);
  };
  loadContent(stream, contentHandler);
};

const createStream = function (filename, CreateFileStream, CreateInputStream) {
  return filename ? CreateFileStream(filename) : CreateInputStream();
};

module.exports = {
  filterHeadLines,
  getHeadLines,
  loadContent,
  createStream
};
