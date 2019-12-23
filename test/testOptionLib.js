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

  it("should return error when the given line count is not a number ", () => {
    const args = "node head.js -n g file".split(" ");
    const actual = function(){getLineCount(args);}
    const error = "head: illegal line count -- g";
    assert.throws(actual, error);
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
    const reader = function(filename, encoding) {
      assert.strictEqual(filename, "appTests/dummy.txt");
      assert.strictEqual(encoding, "utf8");
      return "dummy text";
    };
    const filenames = ["appTests/dummy.txt"];
    const actual = loadContent(reader, filenames);
    const expected = "dummy text";
    assert.strictEqual(actual, expected);
  });

  it("should throw error if file doesn't exists", () => {
    const reader = function(filename, encoding) {
      assert.strictEqual(filename, "dummy.txt");
      assert.strictEqual(encoding, "utf8");
      return "dummy text";
    };
    const actual = function() {
      loadContent(reader, filenames);
    };
    const expected = "head: dummy.txt: No such file or directory";
    const filenames = ["dummy.txt"];
    assert.throws(actual, expected);
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
