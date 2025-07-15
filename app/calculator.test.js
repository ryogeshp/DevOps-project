const calculator = require('../src/calculator');

describe('Calculator', () => {
  test('single number returns itself', () => {
    expect(calculator.add('1')).toBe(1);
  });

  test('comma-separated numbers return sum', () => {
    expect(calculator.add('4,5')).toBe(9);
    expect(calculator.add('2,8,4')).toBe(14);
    expect(calculator.add('2,0,4,5')).toBe(11);
  });

  test('empty input returns 0', () => {
    expect(calculator.add('')).toBe(0);
    expect(calculator.add()).toBe(0);
    expect(calculator.add(null)).toBe(0);
  });

  test('handles spaces between numbers', () => {
    expect(calculator.add(' 3 , 7 , 1 ')).toBe(11);
    expect(calculator.add('1, 2, 3')).toBe(6);
  });

  test('non-numeric values throw error', () => {
    expect(() => calculator.add('2,a,4')).toThrow('Invalid number: a');
    expect(() => calculator.add('abc')).toThrow('Invalid number: abc');
  });

  test('newline delimiter works', () => {
    expect(calculator.add('1\n2,3')).toBe(6);
    expect(calculator.add('1\n2\n3')).toBe(6);
  });

  test('custom delimiter works', () => {
    expect(calculator.add('//;\n1;2')).toBe(3);
    expect(calculator.add('//*\n1*2*3')).toBe(6);
  });

  test('multiple custom delimiters work', () => {
    expect(calculator.add('//;|%\n1;2%3')).toBe(6);
    expect(calculator.add('//@|$\n1@2$3')).toBe(6);
  });

  test('negative numbers throw exception', () => {
    expect(() => calculator.add('1,-2,3')).toThrow('Negative numbers not allowed: -2');
    expect(() => calculator.add('1,-2,-3')).toThrow('Negative numbers not allowed: -2, -3');
  });

  test('numbers >1000 are ignored', () => {
    expect(calculator.add('2,1001')).toBe(2);
    expect(calculator.add('1001,1002,5')).toBe(5);
  });

  test('invalid custom format throws error', () => {
    expect(() => calculator.add('//;\n')).toThrow('Invalid custom delimiter format');
    expect(() => calculator.add('//;\n ')).toThrow('Invalid number');
  });

  test('non-string input throws error', () => {
    expect(() => calculator.add(123)).toThrow('Input must be a string');
    expect(() => calculator.add({})).toThrow('Input must be a string');
  });
});
