const loadContent = function (inputStream, returnContent) {
  let lineCount = 1;
  const defaultLineCount = 10;
  inputStream.on('data', data => {
    if (lineCount === defaultLineCount) {
      inputStream.destroy();
    }
    lineCount++;
    returnContent({
      errMsg: '',
      headLines: data.toString()
    });
  });
  inputStream.on('error', err => {
    inputStream.destroy();
    returnContent({
      errMsg: `head: ${err.path}: No such file or directory`,
      headLines: ''
    });
  });
};

const getHeadLines = function (content) {
  const lines = content.headLines.split('\n');
  const firstIndex = 0;
  const eleventhIndex = 10;
  const headLines = lines.slice(firstIndex, eleventhIndex);
  return {
    errMsg: content.errMsg,
    headLines: headLines.join('\n')
  };
};

const filterHeadLines = function (inputStream, writer) {
  loadContent(inputStream, content => {
    const headLines = getHeadLines(content);
    writer(headLines);
  });
};

const getInputStream = function (filenames, streams) {
  const firstElementIndex = 0;
  if (filenames.length === firstElementIndex) {
    return streams.inputReader;
  }
  return streams.fileReader(filenames[firstElementIndex]);
};

module.exports = {
  filterHeadLines,
  getHeadLines,
  loadContent,
  getInputStream
};
