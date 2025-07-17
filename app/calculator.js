class Calculator {
  static calculate(expression) {
    if (!expression || typeof expression !== 'string') {
      throw new Error('Invalid expression');
    }

    // Validate expression contains only allowed characters
    if (!/^[0-9+\-*\/^.()\s]+$/.test(expression)) {
      throw new Error('Invalid characters in expression');
    }

    try {
      // Replace ^ with ** for exponentiation
      const sanitized = expression.replace(/\^/g, '**');
      
      // Validate parentheses are balanced
      if ((sanitized.match(/\(/g) || []).length !== (sanitized.match(/\)/g) || []).length) {
        throw new Error('Mismatched parentheses');
      }
      
      // Use Function constructor as a safer alternative to eval
      const result = new Function(`return ${sanitized}`)();
      
      if (typeof result !== 'number' || isNaN(result)) {
        throw new Error('Invalid calculation result');
      }
      
      return result;
    } catch (error) {
      throw new Error('Invalid mathematical expression');
    }
  }
}

module.exports = Calculator;
