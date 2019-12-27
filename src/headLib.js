const loadContentFromFile = function(read, filename, returnFileContent) {
  read(filename, "utf8", (err, data) => {
    if (err) {
      const errMsg = `head: ${filename}: No such file or directory`;
      returnFileContent({
        errMsg,
        headLines: ""
      });
      return;
    }
    returnFileContent(data);
  });
};

const loadContent = function(read, stdin, filenames, returnContent) {
  if (filenames.length !== 0) {
    loadContentFromFile(read, filenames[0], content => {
      returnContent(content);
    });
    return;
  }
  let lineCount = 1;
  stdin.on("data", data => {
    if (lineCount == 10) {
      stdin.pause();
    }
    returnContent(data.toString());
    lineCount++;
  });
};

const getHeadLines = function(content, lineCount) {
  const lines = content.split("\n");
  const headLines = lines.slice(0, lineCount);
  return {
    errMsg: "",
    headLines: headLines.join("\n")
  };
};

const filterHeadLines = function(args, read, stdin, writer) {
  const filenames = args.slice(2);
  loadContent(read, stdin, filenames, content => {
    if (content.errMsg) {
      writer(content);
      return;
    }
    const headLines = getHeadLines(content, 10);
    writer(headLines);
  });
};

module.exports = {
  filterHeadLines,
  getHeadLines,
  loadContent
};
