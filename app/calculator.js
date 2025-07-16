/**
 * Scientific Calculator with BODMAS support
 * Handles negative numbers and complex expressions
 */
class Calculator {
  /**
   * Evaluate a mathematical expression
   * @param {string} expression - Mathematical expression
   * @returns {number} Result of the calculation
   * @throws {Error} For invalid expressions
   */
  static calculate(expression) {
    // Validate input
    if (!expression || typeof expression !== 'string') {
      throw new Error('Invalid expression');
    }

    // Remove spaces and convert to lowercase
    const cleaned = expression.replace(/\s+/g, '').toLowerCase();

    // Handle parentheses using recursive evaluation
    const evaluated = this._evaluateParentheses(cleaned);
    
    // Evaluate the expression
    return this._evaluateExpression(evaluated);
  }

  /**
   * Recursively evaluate expressions inside parentheses
   * @param {string} expr - Expression to evaluate
   * @returns {string} Expression with parentheses resolved
   */
  static _evaluateParentheses(expr) {
    while (expr.includes('(')) {
      let start = expr.lastIndexOf('(');
      let end = expr.indexOf(')', start);
      
      if (end === -1) throw new Error('Mismatched parentheses');
      
      const inner = expr.substring(start + 1, end);
      const result = this._evaluateExpression(inner);
      expr = expr.substring(0, start) + result + expr.substring(end + 1);
    }
    return expr;
  }

  /**
   * Evaluate a mathematical expression without parentheses
   * @param {string} expr - Expression to evaluate
   * @returns {number} Result
   */
  static _evaluateExpression(expr) {
    // Handle negative numbers at start
    if (expr.startsWith('-')) {
      expr = '0' + expr;
    }

    // Tokenize the expression
    const tokens = this._tokenize(expr);
    
    // Apply BODMAS operations in correct order
    this._applyOperations(tokens, ['^']);
    this._applyOperations(tokens, ['*', '/']);
    this._applyOperations(tokens, ['+', '-']);
    
    if (tokens.length !== 1 || typeof tokens[0] !== 'number') {
      throw new Error('Invalid expression');
    }
    
    return tokens[0];
  }

  /**
   * Tokenize an expression into numbers and operators
   * @param {string} expr - Expression to tokenize
   * @returns {Array} Tokens
   */
  static _tokenize(expr) {
    const tokens = [];
    let current = '';
    let lastTokenWasOperator = true; // Start expecting a number (possibly negative)

    for (let i = 0; i < expr.length; i++) {
      const char = expr[i];
      
      // Handle negative numbers
      if (char === '-' && lastTokenWasOperator) {
        current = '-';
        lastTokenWasOperator = false;
        continue;
      }
      
      if (this._isDigit(char) || char === '.') {
        current += char;
        lastTokenWasOperator = false;
      } else {
        if (current !== '') {
          tokens.push(parseFloat(current));
          current = '';
        }
        
        if (this._isOperator(char)) {
          tokens.push(char);
          lastTokenWasOperator = true;
        } else {
          throw new Error(`Invalid character: ${char}`);
        }
      }
    }
    
    if (current !== '') {
      tokens.push(parseFloat(current));
    }
    
    return tokens;
  }

  /**
   * Apply operations based on BODMAS precedence
   * @param {Array} tokens - Token array
   * @param {Array} operators - Operators to apply
   */
  static _applyOperations(tokens, operators) {
    let i = 0;
    while (i < tokens.length) {
      if (operators.includes(tokens[i])) {
        if (i === 0 || i === tokens.length - 1) {
          throw new Error('Invalid operator position');
        }
        
        const left = tokens[i - 1];
        const operator = tokens[i];
        const right = tokens[i + 1];
        
        if (typeof left !== 'number' || typeof right !== 'number') {
          throw new Error('Operand must be a number');
        }
        
        const result = this._performOperation(left, operator, right);
        
        // Replace the operation with its result
        tokens.splice(i - 1, 3, result);
      } else {
        i++;
      }
    }
  }

  /**
   * Perform a mathematical operation
   * @param {number} left - Left operand
   * @param {string} operator - Operator
   * @param {number} right - Right operand
   * @returns {number} Result
   */
  static _performOperation(left, operator, right) {
    switch (operator) {
      case '^': return Math.pow(left, right);
      case '*': return left * right;
      case '/': 
        if (right === 0) throw new Error('Division by zero');
        return left / right;
      case '+': return left + right;
      case '-': return left - right;
      default: throw new Error(`Unknown operator: ${operator}`);
    }
  }

  /**
   * Check if character is a digit
   * @param {string} char - Character to check
   * @returns {boolean}
   */
  static _isDigit(char) {
    return /[0-9]/.test(char);
  }

  /**
   * Check if character is an operator
   * @param {string} char - Character to check
   * @returns {boolean}
   */
  static _isOperator(char) {
    return ['+', '-', '*', '/', '^'].includes(char);
  }
}

module.exports = Calculator;
