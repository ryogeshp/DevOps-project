const math = require('mathjs');

class Calculator {
  static calculate(expression) {
    // Check if the expression is valid and a string
    if (!expression || typeof expression !== 'string') {
      throw new Error('Invalid expression');
    }

    // Validate that only allowed characters are present (numbers, operators, parentheses, spaces)
    if (!/^[0-9+\-*\/^.()\s]+$/.test(expression)) {
      throw new Error('Invalid characters in expression');
    }

    // Check for consecutive operators using a regular expression
    if (/([+\-*\/^]){2,}/.test(expression)) {
      throw new Error('Consecutive operators are not allowed');
    }

    // Validate that parentheses are balanced
    const openParens = (expression.match(/\(/g) || []).length;
    const closeParens = (expression.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      throw new Error('Mismatched parentheses');
    }

    try {
      // Evaluate the expression using mathjs
      const result = math.evaluate(expression);

      // Check if the result is a valid number
      if (typeof result !== 'number' || isNaN(result)) {
        throw new Error('Invalid calculation result');
      }

      // Check for division by zero (returns Infinity)
      if (!isFinite(result)) {
        throw new Error('Division by zero');
      }

      return result;
    } catch (error) {
      // Catch any evaluation errors from mathjs
      throw new Error('Invalid mathematical expression');
    }
  }
}

module.exports = Calculator;
