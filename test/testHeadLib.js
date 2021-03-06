const assert = require('chai').assert;
const sinon = require('sinon');
const {
  filterHeadLines,
  loadContent,
  getHeadLines,
  createStream
} = require('../src/headLib');

describe('#getHeadLines()', () => {
  it('should return first 10 lines if content have more than 10 lines', () => {
    const headLines = '123456789101112'.split('').join('\n');
    const actual = getHeadLines(headLines);
    assert.deepStrictEqual(actual, '1234567891'.split('').join('\n'));
  });

  it('should return all lines when content has less than 10 lines', () => {
    const headLines = '12345678'.split('').join('\n');
    const actual = getHeadLines(headLines);
    assert.deepStrictEqual(actual, '12345678'.split('').join('\n'));
  });

  it('should return all lines when content has only 10 lines', () => {
    const headLines = '1234567891'.split('').join('\n');
    const actual = getHeadLines(headLines);
    assert.deepStrictEqual(actual, '1234567891'.split('').join('\n'));
  });
});

describe('#loadContent()', () => {
  const firstIndex = 0, secondIndex = 1;
  let inputReader;
  let onLoadComplete;
  let fileReader;

  beforeEach(() => {
    fileReader = { on: sinon.spy(), destroy: sinon.spy() };
    inputReader = { on: sinon.spy(), destroy: sinon.spy() };
    onLoadComplete = sinon.spy();
  });

  context('#Reading from stdin', () => {

    beforeEach(() => {
      loadContent(inputReader, onLoadComplete);
      assert.strictEqual(inputReader.on.firstCall.args[firstIndex], 'data');
      assert.strictEqual(inputReader.on.secondCall.args[firstIndex], 'error');
    });

    it('should read content from stdin', () => {
      inputReader.on.firstCall.args[secondIndex]('content');
      assert.ok(onLoadComplete.calledWith({
        errMsg: '',
        lines: 'content'
      }));
    });

    it('should end after 10 lines if more than 10 lines are given', (done) => {
      const numLimit = 20, expectedCallCount = 10;
      for (let num = 0; num < numLimit; num++) {
        if (inputReader.destroy.called) {
          assert.equal(onLoadComplete.callCount, expectedCallCount);
          done();
        }
        inputReader.on.firstCall.args[secondIndex]('content');
        assert.ok(onLoadComplete.calledWith({
          errMsg: '',
          lines: 'content'
        }));
      }
    });

    it('should end after 10 lines if only 10 lines are given', (done) => {
      const numLimit = 11, expectedCallCount = 10;
      for (let num = 0; num < numLimit; num++) {
        if (inputReader.destroy.called) {
          assert.equal(onLoadComplete.callCount, expectedCallCount);
          done();
        }
        inputReader.on.firstCall.args[secondIndex]('content');
        assert.ok(onLoadComplete.calledWith({
          errMsg: '',
          lines: 'content'
        }));
      }
    });

    it('should end when control+d is pressed', (done) => {
      const numLimit = 11, expectedCallCount = 6, numberOfLines = 6;
      for (let num = 0; num < numLimit; num++) {
        if (num === numberOfLines) {
          inputReader.destroy();
        }
        if (inputReader.destroy.called) {
          assert.equal(onLoadComplete.callCount, expectedCallCount);
          done();
        }
        inputReader.on.firstCall.args[secondIndex]('content');
        assert.ok(onLoadComplete.calledWith({
          errMsg: '',
          lines: 'content'
        }));
      }
    });
  });

  context('#Reading from files', () => {

    beforeEach(() => {
      loadContent(fileReader, onLoadComplete);
      assert.strictEqual(fileReader.on.firstCall.args[firstIndex], 'data');
      assert.strictEqual(fileReader.on.secondCall.args[firstIndex], 'error');
    });

    it('should return content of the file', () => {
      fileReader.on.firstCall.args[secondIndex]('content');
      assert.ok(onLoadComplete.called);
      const [actual] = onLoadComplete.firstCall.args;
      assert.deepStrictEqual(actual, {
        errMsg: '',
        lines: 'content'
      });
    });

    it('should give error when file is not present', () => {
      fileReader.on.secondCall.args[secondIndex]({ path: 'invalid_file.txt' });
      assert.ok(onLoadComplete.called);
      const [actual] = onLoadComplete.firstCall.args;
      assert.deepStrictEqual(actual, {
        errMsg: 'head: invalid_file.txt: No such file or directory',
        lines: ''
      });
    });

  });
});

describe('#createStream()', () => {
  let fileReader;
  let inputReader;
  const onSpy = sinon.spy();
  const destroySpy = sinon.spy();

  beforeEach(() => {
    fileReader = function () {
      return { on: onSpy, destroy: destroySpy };
    };
    inputReader = function () {
      return { on: onSpy, destroy: destroySpy };
    };
  });

  it('should return fs read stream when file is given', () => {
    const [, , filename] = 'node head.js only_10_lines.txt'.split(' ');
    const stream = createStream(filename, fileReader, inputReader);
    assert.deepStrictEqual(stream, { on: onSpy, destroy: destroySpy });
  });

  it('should return inputStream when no file is given', () => {
    const [, , filename] = 'node head.js'.split(' ');
    const stream = createStream(filename, fileReader, inputReader);
    assert.deepStrictEqual(stream, { on: onSpy, destroy: destroySpy });
  });
});

describe('#filterHeadLines()', () => {
  const firstIndex = 0;
  const secondIndex = 1;
  let inputReader;
  let fileReader;
  let showResult;

  beforeEach(() => {
    fileReader = { on: sinon.spy(), destroy: sinon.spy() };
    inputReader = { on: sinon.spy(), destroy: sinon.spy() };
    showResult = sinon.spy();
  });

  context('#Filtering head lines with files', () => {

    beforeEach(() => {
      filterHeadLines(fileReader, showResult);
      assert.strictEqual(fileReader.on.firstCall.args[firstIndex], 'data');
      assert.strictEqual(fileReader.on.secondCall.args[firstIndex], 'error');
    });

    it('should give first head lines of the file', () => {
      fileReader.on.firstCall.args[secondIndex]('content');
      assert.ok(showResult.called);
      const actual = showResult.firstCall.args[firstIndex];
      assert.deepStrictEqual(actual, {
        errMsg: '',
        headLines: 'content'
      });
      fileReader.destroy();
    });

    it('should give error if file not exists', () => {
      fileReader.on.secondCall.args[secondIndex]({ path: 'invalid_file.txt' });
      assert.ok(showResult.called);
      const actual = showResult.firstCall.args[firstIndex];
      assert.deepStrictEqual(actual, {
        errMsg: 'head: invalid_file.txt: No such file or directory',
        headLines: ''
      });
      fileReader.destroy();
    });
  });

  context('#Filtering head lines with input stream', () => {

    beforeEach(() => {
      filterHeadLines(inputReader, showResult);
      assert.strictEqual(inputReader.on.firstCall.args[firstIndex], 'data');
      assert.strictEqual(inputReader.on.secondCall.args[firstIndex], 'error');
    });

    it('should read content from the stdin when no file is given', () => {
      inputReader.on.firstCall.args[secondIndex]('content');
      assert.ok(showResult.called);
      const actual = showResult.firstCall.args[firstIndex];
      assert.deepStrictEqual(actual, {
        errMsg: '',
        headLines: 'content'
      });
      inputReader.destroy();
    });
  });

});
