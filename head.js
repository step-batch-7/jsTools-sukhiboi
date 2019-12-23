const { readFileSync } = require("fs");
const {
  getLineCount,
  filterFilenames,
  loadContent,
  filterLines
} = require("./src/headLib");

const main = function() {
  const args = process.argv;
  try {
    const lineCount = getLineCount(args);
    const filenames = filterFilenames(args);
    const content = loadContent(readFileSync, filenames);
    const lines = filterLines(content, lineCount);
    console.log(lines);
  } catch (err) {
    console.error(err.message);
  }
};

main();
