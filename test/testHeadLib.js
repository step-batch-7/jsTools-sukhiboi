const assert = require("chai").assert;
const {
  getLineCount,
  filterFilenames,
  loadContent,
  filterLines
} = require("../src/headLib");

describe("#getLineCount()", () => {
  it("should return 10 when '-n' option is not specified ", () => {
    const args = "node head.js file".split(" ");
    const actual = getLineCount(args);
    assert.strictEqual(actual, 10);
  });
});

describe("#filterFilenames()", () => {
  it("should return the array which contain the filenames", () => {
    const args = "node head.js file".split(" ");
    const actual = filterFilenames(args);
    const expected = "file".split(" ");
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#loadContent()", () => {
  it("should load the contents of given file(s)", () => {
    const reader = function(filename, encoding) {
      assert.strictEqual(filename, "appTests/more_than_10_lines.txt");
      assert.strictEqual(encoding, "utf8");
      return "some lines of text";
    };
    const filenames = ["appTests/more_than_10_lines.txt"];
    const actual = loadContent(reader, filenames);
    const expected = "some lines of text";
    assert.strictEqual(actual, expected);
  });

  it("should throw error if file doesn't exists", () => {
    const reader = function(filename, encoding) {
      assert.strictEqual(filename, "invalid_file.txt");
      assert.strictEqual(encoding, "utf8");
      return "invalid_file";
    };
    const actual = function() {
      loadContent(reader, filenames);
    };
    const expected = "head: invalid_file.txt: No such file or directory";
    const filenames = ["invalid_file.txt"];
    assert.throws(actual, expected);
  });
});

describe("#filterLines()", () => {
  it("should give first 10 lines when there are more than 10 lines in content", () => {
    const content = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11";
    const actual = filterLines(content, 10);
    const expected = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10";
    assert.strictEqual(actual, expected);
  });

  it("should give first 10 lines when there are only 10 lines in content", () => {
    const content = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10";
    const actual = filterLines(content, 10);
    const expected = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10";
    assert.strictEqual(actual, expected);
  });

  it("should give all the when there less than ten lines in content", () => {
    const content = "1\n2\n3\n4\n5\n6\n7";
    const actual = filterLines(content, 10);
    const expected = "1\n2\n3\n4\n5\n6\n7";
    assert.strictEqual(actual, expected);
  });

  it("should give nothing when nothing is there in content", () => {
    const content = "";
    const actual = filterLines(content, 10);
    const expected = "";
    assert.strictEqual(actual, expected);
  });
});
