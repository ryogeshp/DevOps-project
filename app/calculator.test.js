const Calculator = require('../src/calculator');

describe('Calculator', () => {
  // Basic arithmetic tests
  test('basic addition', () => {
    expect(Calculator.calculate('2+3')).toBe(5);
  });

  test('addition with negative numbers', () => {
    expect(Calculator.calculate('-2+3')).toBe(1);
    expect(Calculator.calculate('2 + -3')).toBe(-1);
  });

  test('subtraction', () => {
    expect(Calculator.calculate('5-3')).toBe(2);
    expect(Calculator.calculate('-5-3')).toBe(-8);
  });

  test('multiplication', () => {
    expect(Calculator.calculate('2*3')).toBe(6);
    expect(Calculator.calculate('-2*3')).toBe(-6);
    expect(Calculator.calculate('2*-3')).toBe(-6);
    expect(Calculator.calculate('-2*-3')).toBe(6);
  });

  test('division', () => {
    expect(Calculator.calculate('6/3')).toBe(2);
    expect(Calculator.calculate('-6/3')).toBe(-2);
    expect(Calculator.calculate('6/-3')).toBe(-2);
    expect(Calculator.calculate('-6/-3')).toBe(2);
  });

  test('exponents', () => {
    expect(Calculator.calculate('2^3')).toBe(8);
    expect(Calculator.calculate('2^-2')).toBe(0.25);
    expect(Calculator.calculate('(-2)^2')).toBe(4);
    expect(Calculator.calculate('-(2^3)')).toBe(-8);
  });

  // Order of operations (BODMAS)
  test('BODMAS order', () => {
    expect(Calculator.calculate('2+3*4')).toBe(14);
    expect(Calculator.calculate('(2+3)*4')).toBe(20);
    expect(Calculator.calculate('2+3^2*4')).toBe(38);
    expect(Calculator.calculate('(2+3)^2*4')).toBe(100);
  });

  // Complex expressions
  test('complex expressions', () => {
    expect(Calculator.calculate('3 + 4 * 2 / (1 - 5)^2')).toBe(3.5);
    expect(Calculator.calculate('2 * (3 + 4) / (1.5 - 0.5)')).toBe(14);
    expect(Calculator.calculate('-2 * (3 + 4) / (1.5 - 0.5)')).toBe(-14);
  });

  // Decimal numbers
  test('decimal numbers', () => {
    expect(Calculator.calculate('2.5 * 3.2')).toBe(8);
    expect(Calculator.calculate('10.5 / 2.5')).toBe(4.2);
  });

  // Expressions with spaces
  test('expressions with spaces', () => {
    expect(Calculator.calculate('2 + 3')).toBe(5);
    expect(Calculator.calculate('2 * ( 3 + 4 )')).toBe(14);
  });

  // Error handling tests
  test('invalid expressions throw errors', () => {
    expect(() => Calculator.calculate('')).toThrow('Invalid expression');
    expect(() => Calculator.calculate('2+')).toThrow('Invalid mathematical expression');
    expect(() => Calculator.calculate('*3')).toThrow('Invalid mathematical expression');
    expect(() => Calculator.calculate('2/0')).toThrow('Division by zero');
    expect(() => Calculator.calculate('2+(3*4')).toThrow('Mismatched parentheses');
    expect(() => Calculator.calculate('abc')).toThrow('Invalid characters in expression');
    expect(() => Calculator.calculate('2++3')).toThrow('Consecutive operators are not allowed');
    expect(() => Calculator.calculate('2*/3')).toThrow('Consecutive operators are not allowed');
  });
});
