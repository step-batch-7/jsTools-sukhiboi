const assert = require("chai").assert;
const {
  filterHeadLines,
  loadContent,
  getHeadLines
} = require("../src/headLib");

describe("#getHeadLines()", () => {
  it("should return first 10 lines when content have more than 10 lines", () => {
    const content = "123456789101112".split("").join("\n");
    const actual = getHeadLines(content, 10);
    const expected = {
      err: false,
      headLines: "1234567891".split("").join("\n")
    };
    assert.deepStrictEqual(actual, expected);
  });

  it("should return all lines when content have less than 10 lines", () => {
    const content = "12345678".split("").join("\n");
    const actual = getHeadLines(content, 10);
    const expected = {
      err: false,
      headLines: "12345678".split("").join("\n")
    };
    assert.deepStrictEqual(actual, expected);
  });

  it("should return all lines when content have only 10 lines", () => {
    const content = "1234567891".split("").join("\n");
    const actual = getHeadLines(content, 10);
    const expected = {
      err: false,
      headLines: "1234567891".split("").join("\n")
    };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#loadContent()", () => {
  it("should return error if file not exists", () => {
    const exists = function(filename) {
      assert.strictEqual(filename, "invalid_file.txt");
      return false;
    };

    const read = function(filename, encoding) {
      assert.strictEqual(filename, "invalid_file.txt");
      assert.strictEqual(encoding, "utf8");
      return "1234567891".split("").join("\n");
    };
    const filenames = ["invalid_file.txt"];
    const actual = loadContent(read, exists, filenames);
    const expected = {
      err: true,
      errMsg: "head: invalid_file.txt: No such file or directory"
    };
    assert.deepStrictEqual(actual, expected);
  });

  it("should return content of the file", () => {
    const exists = function(filename) {
      assert.strictEqual(filename, "appTests/only_10_lines.txt");
      return true;
    };

    const read = function(filename, encoding) {
      assert.strictEqual(filename, "appTests/only_10_lines.txt");
      assert.strictEqual(encoding, "utf8");
      return "1234567891".split("").join("\n");
    };
    const filenames = ["appTests/only_10_lines.txt"];
    const actual = loadContent(read, exists, filenames);
    const expected = "1234567891".split("").join("\n");
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#filterHeadLines()", () => {
  it("should give first head lines of the file", () => {
    const exists = function(filename) {
      assert.strictEqual(filename, "appTests/only_10_lines.txt");
      return true;
    };

    const read = function(filename, encoding) {
      assert.strictEqual(filename, "appTests/only_10_lines.txt");
      assert.strictEqual(encoding, "utf8");
      return "1234567891".split("").join("\n");
    };

    const ioTools = {
      reader: read,
      exists: exists
    };

    const args = "node head.js appTests/only_10_lines.txt".split(" ");
    const actual = filterHeadLines(args, ioTools);
    const expected = {
      err: false,
      headLines: "1234567891".split("").join("\n")
    };
    assert.deepStrictEqual(actual, expected);
  });

  it("should give error if file not exists", () => {
    const exists = function(filename) {
      assert.strictEqual(filename, "invalid_file.txt");
      return false;
    };

    const read = function(filename, encoding) {
      assert.strictEqual(filename, "invalid_file.txt");
      assert.strictEqual(encoding, "utf8");
      return "1234567891".split("").join("\n");
    };

    const ioTools = {
      reader: read,
      exists: exists
    };

    const args = "node head.js invalid_file.txt".split(" ");
    const actual = filterHeadLines(args, ioTools);
    const expected = {
      err: true,
      errMsg: "head: invalid_file.txt: No such file or directory"
    };
    assert.deepStrictEqual(actual, expected);
  });
});
