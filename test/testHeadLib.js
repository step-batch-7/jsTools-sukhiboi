const assert = require("chai").assert;
const {
  performHead,
  loadContent,
  getHeadLines,
  generateHeadReport
} = require("../src/headLib");

describe("#generateHeadReport()", () => {
  it("should generate Head para", () => {
    const actual = generateHeadReport(true, "my custom error", "error");
    const expected = {
      isErr: true,
      para: "my custom error",
      type: "error"
    };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#getHeadLines()", () => {
  it("should return first 10 lines when content have more than 10 lines", () => {
    const content = "123456789101112".split("").join("\n");
    const actual = getHeadLines(content, 10);
    const expected = {
      isErr: false,
      para: "1234567891".split("").join("\n"),
      type: "output"
    };
    assert.deepStrictEqual(actual, expected);
  });

  it("should return all lines when content have less than 10 lines", () => {
    const content = "12345678".split("").join("\n");
    const actual = getHeadLines(content, 10);
    const expected = {
      isErr: false,
      para: "12345678".split("").join("\n"),
      type: "output"
    };
    assert.deepStrictEqual(actual, expected);
  });

  it("should return all lines when content have only 10 lines", () => {
    const content = "1234567891".split("").join("\n");
    const actual = getHeadLines(content, 10);
    const expected = {
      isErr: false,
      para: "1234567891".split("").join("\n"),
      type: "output"
    };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#loadContent()", () => {
  it("should return error if file not exists", () => {
    const read = function(filename, encoding) {
      assert.strictEqual(filename, "invalid_file.txt");
      assert.strictEqual(encoding, "utf8");
      return "1234567891".split("").join("\n");
    };
    const filenames = ["invalid_file.txt"];
    const actual = loadContent(read, filenames);
    const expected = {
      isErr: true,
      para: "head: invalid_file.txt: No such file or directory",
      type: "error"
    };
    assert.deepStrictEqual(actual, expected);
  });

  it("should return content of the file", () => {
    const read = function(filename, encoding) {
      assert.strictEqual(filename, "appTests/only_10_lines.txt");
      assert.strictEqual(encoding, "utf8");
      return "1234567891".split("").join("\n");
    };
    const filenames = ["appTests/only_10_lines.txt"];
    const actual = loadContent(read, filenames);
    const expected = "1234567891".split("").join("\n");
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#performHead()", () => {
  it("should give first head lines of the file", () => {
    const args = "node head.js appTests/only_10_lines.txt".split(" ");
    const actual = performHead(args);
    const expected = {
      isErr: false,
      para: "1234567891".split("").join("\n"),
      type: "output"
    };
    assert.deepStrictEqual(actual, expected);
  });

  it("should give error if file not exists", () => {
    const args = "node head.js invalid_file.txt".split(" ");
    const actual = performHead(args);
    const expected = {
      isErr: true,
      para: "head: invalid_file.txt: No such file or directory",
      type: "error"
    };
    assert.deepStrictEqual(actual, expected);
  });
});
