const calculator = require('../src/calculator');

test('single number returns itself', () => {
  expect(calculator.add('1')).toBe(1);
});

test('two comma-separated numbers return sum', () => {
  expect(calculator.add('4,5')).toBe(9);
});

test('three comma-separated numbers return sum', () => {
  expect(calculator.add('2,8,4')).toBe(14);
});

test('empty string returns 0', () => {
  expect(calculator.add('')).toBe(0);
});

test('spaces between numbers work', () => {
  expect(calculator.add(' 3 , 7 , 1 ')).toBe(11);
});

test('non-numeric values throw error', () => {
  expect(() => calculator.add('2,a,4')).toThrow('Invalid number: a');
});

test('newline delimiter works', () => {
  expect(calculator.add('1\n2,3')).toBe(6);
});

test('custom delimiter works', () => {
  expect(calculator.add('//;\n1;2')).toBe(3);
});

test('multiple custom delimiters work', () => {
  expect(calculator.add('//;|%\n1;2%3')).toBe(6);
});

test('negative numbers throw exception', () => {
  expect(() => calculator.add('1,-2,3')).toThrow('Negative numbers not allowed: -2');
});

test('multiple negatives in exception', () => {
  expect(() => calculator.add('1,-2,-3')).toThrow('Negative numbers not allowed: -2, -3');
});

test('numbers >1000 are ignored', () => {
  expect(calculator.add('2,1001')).toBe(2);
});

test('custom delimiter with regex chars', () => {
  expect(calculator.add('//*\n1*2*3')).toBe(6);
});

test('invalid custom format throws error', () => {
  expect(() => calculator.add('//;\n')).toThrow('Invalid custom delimiter format');
});
