const assert = require("chai").assert;
const { getLineCount, filterFilenames } = require("../src/optionLib");

describe("#getLineCount()", () => {
  it("should return 10 when '-n' option is not specified ", () => {
    const args = "node head.js file".split(" ");
    const actual = getLineCount(args);
    assert.strictEqual(actual, 10);
  });

  it("should return 5 when '-n' option is specified with lineCount as 5 ", () => {
    const args = "node head.js -n 5 file".split(" ");
    const actual = getLineCount(args);
    assert.strictEqual(actual, 5);
  });
});

describe("#filterFilenames()", () => {
  it("should return the array which contain the filenames", () => {
    const args = "node head.js file".split(" ");
    const actual = filterFilenames(args);
    const expected = "file".split(" ");
    assert.deepStrictEqual(actual, expected);
  });

  it("should return the array which contain the filenames when the line count is specified", () => {
    const args = "node head.js -n 5 file".split(" ");
    const actual = filterFilenames(args);
    const expected = "file".split(" ");
    assert.deepStrictEqual(actual, expected);
  });
});
