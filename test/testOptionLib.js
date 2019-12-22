const assert = require("chai").assert;
const { getLineCount } = require("../src/optionLib");

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
