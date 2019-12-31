const generateErrorMsg = function (err) {
  const errMsg = `head: ${err.path}: No such file or directory`;
  return errMsg;
};

const formatContent = function (errMsg, headLines) {
  const formatedContent = {
    errMsg,
    headLines
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
  const lines = content.headLines.split('\n');
  const firstIndex = 0;
  const eleventhIndex = 10;
  const headLines = lines.slice(firstIndex, eleventhIndex);
  return headLines.join('\n');
};

const filterHeadLines = function (inputStream, writer) {
  loadContent(inputStream, content => {
    const headLines = getHeadLines(content);
    const headOutcome = {
      errMsg: content.errMsg,
      headLines
    };
    writer(headOutcome);
  });
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
