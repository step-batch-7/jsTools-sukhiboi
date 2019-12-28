const event = require("events");
const assert = require("chai").assert;
const {
  filterHeadLines,
  loadContent,
  getHeadLines,
  getInputStream
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

describe("#loadContent()", () => {
  it("should read content from stdin when no file is given", () => {
    const stdin = new event.EventEmitter();
    let count = 0;
    const returnContent = function(content) {
      count = count + 1;
      assert.strictEqual(content, "content");
    };
    loadContent(stdin, returnContent);
    stdin.emit("data", "content");
    assert.strictEqual(count, 1);
  });

  it("should return content of the file", () => {
    let count = 0;
    const returnContent = function(content) {
      count++;
      const expected = "content";
      assert.deepStrictEqual(content, expected);
    };
    const filenames = ["only_10_lines.txt"];
    const fileReader = new event.EventEmitter(filenames[0]);
    loadContent(fileReader, returnContent);
    fileReader.emit("data", "content");
    assert.equal(count, 1);
  });

  it("should give error when file is not present", () => {
    let count = 0;
    const returnContent = function(content) {
      count++;
      const expected = {
        errMsg: "head: invalid_file.txt: No such file or directory",
        headLines: ""
      };
      assert.deepStrictEqual(content, expected);
    };
    const filenames = ["invalid_file.txt"];
    const fileReader = new event.EventEmitter(filenames[0]);
    loadContent(fileReader, returnContent);
    fileReader.emit("error", { path: filenames[0] });
    assert.equal(count, 1);
  });
});

describe("#getInputStream()", () => {
  it("should return fs read stream when file is given", () => {
    const args = "node head.js only_10_lines.txt".split(" ");
    const fileReader = function() {
      return new event.EventEmitter();
    };
    const streams = {
      fileReader,
      inputReader: process.stdin
    };
    const inputStream = getInputStream(args.slice(2), streams);
    assert.deepStrictEqual(inputStream, streams.fileReader(args[2]));
  });

  it("should return stdin when no file is given", () => {
    const args = "node head.js".split(" ");
    const fileReader = function() {
      return new event.EventEmitter();
    };
    const streams = {
      fileReader,
      inputReader: process.stdin
    };
    const inputStream = getInputStream(args.slice(2), streams);
    assert.deepStrictEqual(inputStream, process.stdin);
  });
});

describe("#filterHeadLines()", () => {
  it("should give first head lines of the file", () => {
    let count = 0;
    const writer = function(content) {
      count++;
      const expected = {
        errMsg: "",
        headLines: "content"
      };
      assert.deepStrictEqual(content, expected);
    };
    const args = "node head.js only_10_lines.txt".split(" ");
    const fileReader = new event.EventEmitter(args[2]);
    filterHeadLines(fileReader, writer);
    fileReader.emit("data", "content");
    assert.equal(count, 1);
  });

  it("should give error if file not exists", () => {
    let count = 0;
    const writer = function(content) {
      count++;
      const expected = {
        errMsg: "head: invalid_file.txt: No such file or directory",
        headLines: ""
      };
      assert.deepStrictEqual(content, expected);
    };
    const args = "node head.js invalid_file.txt".split(" ");
    const fileReader = new event.EventEmitter(args[2]);
    filterHeadLines(fileReader, writer);
    fileReader.emit("error", { path: args[2] });
    assert.equal(count, 1);
  });

  it("should read content from the stdin when no file is given", () => {
    let count = 0;
    const stdin = new event.EventEmitter();
    const writer = function(content) {
      count++;
      const expected = {
        errMsg: "",
        headLines: "content"
      };
      assert.deepStrictEqual(content, expected);
    };
    filterHeadLines(stdin, writer);
    stdin.emit("data", "content");
    assert.equal(count, 1);
  });
});
