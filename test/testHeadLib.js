const event = require('events');
const assert = require('chai').assert;
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
  it('should read content from stdin when no file is given', () => {
    const stdin = new event.EventEmitter();
    let count = 0;
    const returnContent = function (content) {
      count++;
      assert.strictEqual(content, 'content');
    };
    loadContent(stdin, returnContent);
    stdin.emit('data', 'content');
    const expectedCount = 1;
    assert.strictEqual(count, expectedCount);
    stdin.emit('end');
  });

  it('should return content of the file', () => {
    let count = 0;
    const returnContent = function (content) {
      count++;
      const expected = 'content';
      assert.deepStrictEqual(content, expected);
    };
    const filenames = ['only_10_lines.txt'];
    const fileReader = new event.EventEmitter(filenames[firstElementIndex]);
    loadContent(fileReader, returnContent);
    fileReader.emit('data', 'content');
    const expectedCount = 1;
    assert.equal(count, expectedCount);
    fileReader.emit('end');
  });

  it('should give error when file is not present', () => {
    let count = 0;
    const returnContent = function (content) {
      count++;
      const expected = {
        errMsg: 'head: invalid_file.txt: No such file or directory',
        headLines: ''
      };
      assert.deepStrictEqual(content, expected);
    };
    const filenames = ['invalid_file.txt'];
    const fileReader = new event.EventEmitter(filenames[firstElementIndex]);
    loadContent(fileReader, returnContent);
    fileReader.emit('error', { path: filenames[firstElementIndex] });
    const expectedCount = 1;
    assert.equal(count, expectedCount);
    fileReader.emit('end');
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
      inputReader: process.stdin
    };
    const inputStream = getInputStream(args.slice(userArgsIndex), streams);
    const readStream = streams.fileReader(args[userArgsIndex]);
    assert.deepStrictEqual(inputStream, readStream);
  });

  it('should return stdin when no file is given', () => {
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
  it('should give first head lines of the file', () => {
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
    filterHeadLines(fileReader, writer);
    fileReader.emit('data', 'content');
    const expectedCount = 1;
    assert.equal(count, expectedCount);
  });

  it('should give error if file not exists', () => {
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
    filterHeadLines(fileReader, writer);
    fileReader.emit('error', { path: args[userArgsIndex] });
    const expectedCount = 1;
    assert.equal(count, expectedCount);
  });

  it('should read content from the stdin when no file is given', () => {
    let count = 0;
    const stdin = new event.EventEmitter();
    const writer = function (content) {
      count++;
      const expected = {
        errMsg: '',
        headLines: 'content'
      };
      assert.deepStrictEqual(content, expected);
    };
    filterHeadLines(stdin, writer);
    stdin.emit('data', 'content');
    const expectedCount = 1;
    assert.equal(count, expectedCount);
    stdin.emit('end');
  });
});
