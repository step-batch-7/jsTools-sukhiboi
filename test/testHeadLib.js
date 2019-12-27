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
      errMsg: "",
      headLines: "1234567891".split("").join("\n")
    };
    assert.deepStrictEqual(actual, expected);
  });

  it("should return all lines when content have less than 10 lines", () => {
    const content = "12345678".split("").join("\n");
    const actual = getHeadLines(content, 10);
    const expected = {
      errMsg: "",
      headLines: "12345678".split("").join("\n")
    };
    assert.deepStrictEqual(actual, expected);
  });

  it("should return all lines when content have only 10 lines", () => {
    const content = "1234567891".split("").join("\n");
    const actual = getHeadLines(content, 10);
    const expected = {
      errMsg: "",
      headLines: "1234567891".split("").join("\n")
    };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#loadContent", () => {
  it("should read content from stdin when no file is given", () => {
    const filenames = [];
    const event = require("events");
    const stdin = new event.EventEmitter();
    const returnContent = function(content) {
      assert.strictEqual(content, "content");
    };
    loadContent(null, stdin, filenames, returnContent);
    stdin.emit("data", "content");
  });

  it("should return content of the file", () => {
    const returnContent = function(content) {
      const expected = "1234567891".split("").join("\n");
      assert.deepStrictEqual(content, expected);
    };
    const readCB = function(err, data) {
      if (err) {
        returnContent(err);
        return;
      }
      returnContent(data);
    };
    const read = function(filename, encoding, readCB) {
      assert.strictEqual(filename, "only_10_lines.txt");
      assert.strictEqual(encoding, "utf8");
      const data = "1234567891".split("").join("\n");
      readCB(null, data);
    };
    const filenames = ["only_10_lines.txt"];
    loadContent(read, null, filenames, returnContent);
  });

  it("should give error when is not present", () => {
    const returnContent = function(content) {
      const expected = {
        errMsg: "head: invalid_file.txt: No such file or directory",
        headLines: ""
      };
      assert.deepStrictEqual(content, expected);
    };
    const readCB = function(err, data) {
      if (err) {
        returnContent(err);
        return;
      }
      returnContent(data);
    };
    const read = function(filename, encoding, readCB) {
      assert.strictEqual(filename, "invalid_file.txt");
      assert.strictEqual(encoding, "utf8");
      readCB("err", null);
    };
    const filenames = ["invalid_file.txt"];
    loadContent(read, null, filenames, returnContent);
  });
});

describe("#filterHeadLines()", () => {
  it("should give first head lines of the file", () => {
    const writer = function(content) {
      const expected = {
        errMsg: "",
        headLines: "1234567891".split("").join("\n")
      };
      assert.deepStrictEqual(content, expected);
    };
    const readCB = function(err, content) {
      if (err) {
        writer(err);
        return;
      }
      writer(content);
    };
    const read = function(filename, encoding, readCB) {
      assert.strictEqual(filename, "appTests/only_10_lines.txt");
      assert.strictEqual(encoding, "utf8");
      readCB(null, "1234567891".split("").join("\n"));
    };
    const args = "node head.js appTests/only_10_lines.txt".split(" ");
    filterHeadLines(args, read, null, writer);
  });

  it("should give error if file not exists", () => {
    const writer = function(content) {
      const expected = {
        errMsg: "head: invalid_file.txt: No such file or directory",
        headLines: ""
      };
      assert.deepStrictEqual(content, expected);
    };
    const readCB = function(err, content) {
      if (err) {
        writer(err);
        return;
      }
      writer(content);
    };
    const read = function(filename, encoding, readCB) {
      assert.strictEqual(filename, "invalid_file.txt");
      assert.strictEqual(encoding, "utf8");
      readCB("err", null);
    };
    const args = "node head.js invalid_file.txt".split(" ");
    filterHeadLines(args, read, null, writer);
  });

  it("should read content from the stdin when no file is given", () => {
    const args = "node head.js".split(" ");
    const event = require("events");
    const stdin = new event.EventEmitter();
    const writer = function(content) {
      const expected = {
        errMsg: "",
        headLines: "content"
      };
      assert.deepStrictEqual(content, expected);
    };
    filterHeadLines(args, null, stdin, writer);
    stdin.emit("data", "content");
  });
});
