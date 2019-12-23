const { readFileSync } = require("fs");
const {
  getLineCount,
  filterFilenames,
  loadContent,
  filterLines
} = require("./src/headLib");

const main = function() {
  try {
    const args = process.argv;
    const lineCount = getLineCount(args);
    const filenames = filterFilenames(args);
    const content = loadContent(readFileSync, filenames);
    const lines = filterLines(content, lineCount);
    console.log(lines);
  } catch (e) {
    console.error(e.message);
  }
};

main();
