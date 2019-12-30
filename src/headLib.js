const loadContent = function (inputStream, returnContent) {
  let lineCount = 1;
  inputStream.on('data', data => {
    const defaultLineCount = 10;
    if (lineCount === defaultLineCount) {
      inputStream.emit('end');
    }
    returnContent(data.toString());
    lineCount++;
  });
  inputStream.on('error', err => {
    returnContent({
      errMsg: `head: ${err.path}: No such file or directory`,
      headLines: ''
    });
  });
};

const getHeadLines = function (content) {
  const lines = content.split('\n');
  const firstIndex = 0;
  const eleventhIndex = 10;
  const headLines = lines.slice(firstIndex, eleventhIndex);
  return {
    errMsg: '',
    headLines: headLines.join('\n')
  };
};

const filterHeadLines = function (inputStream, writer) {
  loadContent(inputStream, content => {
    if (content.errMsg) {
      writer(content);
      return;
    }
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
