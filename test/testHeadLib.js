const event = require('events');
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
    const content = '123456789101112'.split('').join('\n');
    const lineCount = 10;
    const actual = getHeadLines(content, lineCount);
    const expected = {
      errMsg: '',
      headLines: '1234567891'.split('').join('\n')
    };
    assert.deepStrictEqual(actual, expected);
  });

  it('should return all lines when content have less than 10 lines', () => {
    const content = '12345678'.split('').join('\n');
    const lineCount = 10;
    const actual = getHeadLines(content, lineCount);
    const expected = {
      errMsg: '',
      headLines: '12345678'.split('').join('\n')
    };
    assert.deepStrictEqual(actual, expected);
  });

  it('should return all lines when content have only 10 lines', () => {
    const content = '1234567891'.split('').join('\n');
    const lineCount = 10;
    const actual = getHeadLines(content, lineCount);
    const expected = {
      errMsg: '',
      headLines: '1234567891'.split('').join('\n')
    };
    assert.deepStrictEqual(actual, expected);
  });
});

describe('#loadContent()', () => {
  const firstElementIndex = 0;
  let inputReader;
  let returnContent;

  beforeEach(() => {
    inputReader = new event.EventEmitter();
    returnContent = sinon.spy();
  });

  context('#Reading from stdin', () => {
    it('should read content from stdin', (done) => {
      inputReader.on('end', done());
      loadContent(inputReader, returnContent);
      inputReader.emit('data', 'content');
      assert.ok(returnContent.called);
      const actual = returnContent.firstCall.args[firstElementIndex];
      assert.strictEqual(actual, 'content');
      inputReader.emit('end');
    });

    it('should pause after 10 lines', (done) => {
      inputReader.on('end', () => {
        const expectedCallCount = 9;
        assert.strictEqual(returnContent.callCount, expectedCallCount);
        done();
      });
      loadContent(inputReader, returnContent);
      const numLimit = 12;
      for (let num = 1; num < numLimit; num++) {
        inputReader.emit('data', 'content');
        assert.ok(returnContent.called);
        const actual = returnContent.firstCall.args[firstElementIndex];
        assert.strictEqual(actual, 'content');
      }
    });
  });

  context('#Reading from files', () => {
    const firstElementIndex = 0;
    it('should return content of the file', (done) => {
      const filenames = ['only_10_lines.txt'];
      const fileReader = new event.EventEmitter(filenames[firstElementIndex]);
      fileReader.on('end', done());
      loadContent(fileReader, returnContent);
      fileReader.emit('data', 'content');
      assert.ok(returnContent.called);
      const actual = returnContent.firstCall.args[firstElementIndex];
      assert.strictEqual(actual, 'content');
      fileReader.emit('end');
    });

    it('should give error when file is not present', (done) => {
      const filenames = ['invalid_file.txt'];
      const fileReader = new event.EventEmitter(filenames[firstElementIndex]);
      fileReader.on('end', done());
      loadContent(fileReader, returnContent);
      fileReader.emit('error', { path: filenames[firstElementIndex] });
      assert.ok(returnContent.called);
      const actual = returnContent.firstCall.args[firstElementIndex];
      assert.deepStrictEqual(actual, {
        errMsg: 'head: invalid_file.txt: No such file or directory',
        headLines: ''
      });
      fileReader.emit('end');
    });

  });
});

describe('#getInputStream()', () => {
  const userArgsIndex = 2;
  it('should return fs read stream when file is given', () => {
    const args = 'node head.js only_10_lines.txt'.split(' ');
    const fileReader = function () {
      return new event.EventEmitter();
    };
    const streams = {
      fileReader,
      inputReader: process.inputStream
    };
    const inputStream = getInputStream(args.slice(userArgsIndex), streams);
    const readStream = streams.fileReader(args[userArgsIndex]);
    assert.deepStrictEqual(inputStream, readStream);
  });

  it('should return inputStream when no file is given', () => {
    const args = 'node head.js'.split(' ');
    const fileReader = function () {
      return new event.EventEmitter();
    };
    const streams = {
      fileReader,
      inputReader: process.stdin
    };
    const inputStream = getInputStream(args.slice(userArgsIndex), streams);
    assert.deepStrictEqual(inputStream, process.stdin);
  });
});

describe('#filterHeadLines()', () => {
  const userArgsIndex = 2;
  it('should give first head lines of the file', (done) => {
    let count = 0;
    const writer = function (content) {
      count++;
      const expected = {
        errMsg: '',
        headLines: 'content'
      };
      assert.deepStrictEqual(content, expected);
    };
    const args = 'node head.js only_10_lines.txt'.split(' ');
    const fileReader = new event.EventEmitter(args[userArgsIndex]);
    fileReader.on('end', () => {
      done();
    });
    filterHeadLines(fileReader, writer);
    fileReader.emit('data', 'content');
    const expectedCount = 1;
    assert.equal(count, expectedCount);
    fileReader.emit('end');
  });

  it('should give error if file not exists', (done) => {
    let count = 0;
    const writer = function (content) {
      count++;
      const expected = {
        errMsg: 'head: invalid_file.txt: No such file or directory',
        headLines: ''
      };
      assert.deepStrictEqual(content, expected);
    };
    const args = 'node head.js invalid_file.txt'.split(' ');
    const fileReader = new event.EventEmitter(args[userArgsIndex]);
    fileReader.on('end', () => {
      done();
    });
    filterHeadLines(fileReader, writer);
    fileReader.emit('error', { path: args[userArgsIndex] });
    const expectedCount = 1;
    assert.equal(count, expectedCount);
    fileReader.emit('end');
  });

  it('should read content from the stdin when no file is given', (done) => {
    let count = 0;
    const writer = function (content) {
      count++;
      const expected = {
        errMsg: '',
        headLines: 'content'
      };
      assert.deepStrictEqual(content, expected);
    };
    const inputReader = new event.EventEmitter();
    inputReader.on('end', () => {
      done();
    });
    filterHeadLines(inputReader, writer);
    inputReader.emit('data', 'content');
    const expectedCount = 1;
    assert.equal(count, expectedCount);
    inputReader.emit('end');
  });
});
