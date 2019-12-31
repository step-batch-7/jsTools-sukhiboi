const generateErrorMsg = function (err) {
  const errMsg = `head: ${err.path}: No such file or directory`;
  return errMsg;
};

const formatContent = function (errMsg, lines) {
  const formatedContent = {
    errMsg,
    lines
  };
  return formatedContent;
};

const loadContent = function (inputStream, onLoadComplete) {
  let lineCount = 0;
  const defaultLineCount = 10;

  inputStream.on('data', data => {
    lineCount++;
    if (lineCount === defaultLineCount) {
      inputStream.destroy();
    }
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
  const firstIndex = 0;
  const eleventhIndex = 10;
  const headLines = lines.slice(firstIndex, eleventhIndex);
  return headLines.join('\n');
};

const filterHeadLines = function (inputStream, writer) {
  const contentHandler = function (content) {
    const headLines = getHeadLines(content.lines);
    const headOutcome = {
      errMsg: content.errMsg,
      headLines
    };
    writer(headOutcome);
  };
  loadContent(inputStream, contentHandler);
};

const getInputStream = function (filename, fileStream, inputStream) {
  return filename ? fileStream(filename) : inputStream;
};

module.exports = {
  filterHeadLines,
  getHeadLines,
  loadContent,
  getInputStream
};
