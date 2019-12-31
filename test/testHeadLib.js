const assert = require('chai').assert;
const sinon = require('sinon');
const {
  filterHeadLines,
  loadContent,
  getHeadLines,
  getInputStream
} = require('../src/headLib');

describe('#getHeadLines()', () => {
  it('should return first 10 lines if content have more than 10 lines', () => {
    const headLines = '123456789101112'.split('').join('\n');
    const content = {
      errMsg: '',
      headLines
    };
    const lineCount = 10;
    const actual = getHeadLines(content, lineCount);
    assert.deepStrictEqual(actual, '1234567891'.split('').join('\n'));
  });

  it('should return all lines when content have less than 10 lines', () => {
    const headLines = '12345678'.split('').join('\n');
    const content = {
      errMsg: '',
      headLines
    };
    const lineCount = 10;
    const actual = getHeadLines(content, lineCount);
    assert.deepStrictEqual(actual, '12345678'.split('').join('\n'));
  });

  it('should return all lines when content have only 10 lines', () => {
    const headLines = '1234567891'.split('').join('\n');
    const content = {
      errMsg: '',
      headLines
    };
    const lineCount = 10;
    const actual = getHeadLines(content, lineCount);
    assert.deepStrictEqual(actual, '1234567891'.split('').join('\n'));
  });
});

describe('#loadContent()', () => {
  const firstIndex = 0, secondIndex = 1;
  let inputReader;
  let returnContent;
  let fileReader;

  beforeEach(() => {
    fileReader = { on: sinon.spy(), destroy: sinon.spy() };
    inputReader = { on: sinon.spy(), destroy: sinon.spy() };
    returnContent = sinon.spy();
  });

  context('#Reading from stdin', () => {
    it('should read content from stdin', () => {
      loadContent(inputReader, returnContent);
      assert.strictEqual(inputReader.on.firstCall.args[firstIndex], 'data');
      assert.strictEqual(inputReader.on.secondCall.args[firstIndex], 'error');
      inputReader.on.firstCall.args[secondIndex]('content');
      assert.ok(returnContent.calledWith({
        errMsg: '',
        headLines: 'content'
      }));
    });

    it('should destroy after 10 lines', (done) => {
      const numLimit = 11, expectedCallCount = 10;
      loadContent(inputReader, returnContent);
      assert.strictEqual(inputReader.on.firstCall.args[firstIndex], 'data');
      assert.strictEqual(inputReader.on.secondCall.args[firstIndex], 'error');
      for (let num = 1; num <= numLimit; num++) {
        if (inputReader.destroy.called) {
          assert.equal(returnContent.callCount, expectedCallCount);
          done();
        }
        inputReader.on.firstCall.args[secondIndex]('content');
        assert.ok(returnContent.calledWith({
          errMsg: '',
          headLines: 'content'
        }));
      }
    });
  });

  context('#Reading from files', () => {
    const firstElementIndex = 0;
    it('should return content of the file', () => {
      loadContent(fileReader, returnContent);
      assert.strictEqual(fileReader.on.firstCall.args[firstIndex], 'data');
      assert.strictEqual(fileReader.on.secondCall.args[firstIndex], 'error');
      fileReader.on.firstCall.args[secondIndex]('content');
      assert.ok(returnContent.called);
      const actual = returnContent.firstCall.args[firstElementIndex];
      assert.deepStrictEqual(actual, {
        errMsg: '',
        headLines: 'content'
      });
    });

    it('should give error when file is not present', () => {
      loadContent(fileReader, returnContent);
      assert.strictEqual(fileReader.on.firstCall.args[firstIndex], 'data');
      assert.strictEqual(fileReader.on.secondCall.args[firstIndex], 'error');
      fileReader.on.secondCall.args[secondIndex]({ path: 'invalid_file.txt' });
      assert.ok(returnContent.called);
      const actual = returnContent.firstCall.args[firstElementIndex];
      assert.deepStrictEqual(actual, {
        errMsg: 'head: invalid_file.txt: No such file or directory',
        headLines: ''
      });
      assert.ok(fileReader.destroy.called);
    });

  });
});

describe('#getInputStream()', () => {
  const userArgsIndex = 2;
  let fileReader;
  let inputReader;
  const onSpy = sinon.spy();
  const destroySpy = sinon.spy();

  beforeEach(() => {
    fileReader = function () {
      return { on: onSpy, destroy: destroySpy };
    };
    inputReader = process.stdin;
  });

  it('should return fs read stream when file is given', () => {
    const args = 'node head.js only_10_lines.txt'.split(' ');
    const streams = {
      fileReader,
      inputReader
    };
    const inputStream = getInputStream(args.slice(userArgsIndex), streams);
    assert.deepStrictEqual(inputStream, { on: onSpy, destroy: destroySpy });
  });

  it('should return inputStream when no file is given', () => {
    const args = 'node head.js'.split(' ');
    const streams = {
      fileReader,
      inputReader
    };
    const inputStream = getInputStream(args.slice(userArgsIndex), streams);
    assert.deepStrictEqual(inputStream, process.stdin);
  });
});

describe('#filterHeadLines()', () => {
  const firstIndex = 0;
  const secondIndex = 1;
  let inputReader;
  let fileReader;
  let writer;

  beforeEach(() => {
    fileReader = { on: sinon.spy(), destroy: sinon.spy() };
    inputReader = { on: sinon.spy(), destroy: sinon.spy() };
    writer = sinon.spy();
  });

  it('should give first head lines of the file', () => {
    filterHeadLines(fileReader, writer);
    assert.strictEqual(fileReader.on.firstCall.args[firstIndex], 'data');
    assert.strictEqual(fileReader.on.secondCall.args[firstIndex], 'error');
    fileReader.on.firstCall.args[secondIndex]('content');
    assert.ok(writer.called);
    const actual = writer.firstCall.args[firstIndex];
    assert.deepStrictEqual(actual, {
      errMsg: '',
      headLines: 'content'
    });
    fileReader.destroy();
  });

  it('should give error if file not exists', () => {
    filterHeadLines(fileReader, writer);
    assert.strictEqual(fileReader.on.firstCall.args[firstIndex], 'data');
    assert.strictEqual(fileReader.on.secondCall.args[firstIndex], 'error');
    fileReader.on.secondCall.args[secondIndex]({ path: 'invalid_file.txt' });
    assert.ok(writer.called);
    const actual = writer.firstCall.args[firstIndex];
    assert.deepStrictEqual(actual, {
      errMsg: 'head: invalid_file.txt: No such file or directory',
      headLines: ''
    });
    fileReader.destroy();
  });

  it('should read content from the stdin when no file is given', () => {
    filterHeadLines(inputReader, writer);
    assert.strictEqual(inputReader.on.firstCall.args[firstIndex], 'data');
    assert.strictEqual(inputReader.on.secondCall.args[firstIndex], 'error');
    inputReader.on.firstCall.args[secondIndex]('content');
    assert.ok(writer.called);
    const actual = writer.firstCall.args[firstIndex];
    assert.deepStrictEqual(actual, {
      errMsg: '',
      headLines: 'content'
    });
    inputReader.destroy();
  });
});
