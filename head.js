const {
  getLineCount,
  filterFilenames,
  loadContent,
  filterLines
} = require("./src/optionLib");

const main = function() {
  const args = process.argv;
  const lineCount = getLineCount(args);
  const filenames = filterFilenames(args)
  const content = loadContent(filenames);
  const lines = filterLines(content, lineCount);
  console.log(lines);
}

main();