const assert = require("chai").assert;
const {
  getLineCount,
  filterFilenames,
  loadContent,
  filterLines
} = require("../src/optionLib");

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

describe("#loadContent()", () => {
  it("should load the contents of given files", () => {
    const filenames = ["test/dummy.txt"];
    const actual = loadContent(filenames);
    const expected = "dummy text";
    assert.strictEqual(actual, expected);
  });
});

describe("#filterLines()", () => {
  it("should give first 10 lines when -n is not specified", () => {
    const content = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11";
    const actual = filterLines(content, 10);
    const expected = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10";
    assert.strictEqual(actual, expected);
  });

  it("should give first n when -n is specified", () => {
    const content = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11";
    const actual = filterLines(content, 4);
    const expected = "1\n2\n3\n4";
    assert.strictEqual(actual, expected);
  });
});