/**
 * Adds numbers from a string input with support for custom delimiters
 * @param {string} numbers - String of numbers separated by delimiters
 * @returns {number} Sum of numbers
 * @throws {Error} If invalid input or negative numbers
 */
function add(numbers) {
  if (!numbers) return 0;
  
  let delimiters = [',', '\n'];
  let numbersString = numbers;
  
  // Check for custom delimiter definition
  if (numbers.startsWith('//')) {
    const delimiterSectionEnd = numbers.indexOf('\n');
    if (delimiterSectionEnd === -1) {
      throw new Error('Invalid custom delimiter format');
    }
    
    const delimiterSection = numbers.substring(2, delimiterSectionEnd);
    // Split by ';' to support multiple delimiters
    const customDelimiters = delimiterSection.split(';');
    delimiters = [...delimiters, ...customDelimiters];
    numbersString = numbers.substring(delimiterSectionEnd + 1);
  }
  
  // Create regex pattern to split by delimiters
  const pattern = new RegExp(`[${delimiters.map(d => escapeRegExp(d)).join('')}]`);
  const tokens = numbersString.split(pattern);
  
  // Parse and validate tokens
  const nums = tokens.map(token => {
    const num = parseInt(token.trim(), 10);
    if (isNaN(num)) throw new Error(`Invalid number: ${token}`);
    return num;
  });
  
  // Check for negatives
  const negatives = nums.filter(num => num < 0);
  if (negatives.length > 0) {
    throw new Error(`Negative numbers not allowed: ${negatives.join(', ')}`);
  }
  
  // Ignore numbers greater than 1000
  const filteredNums = nums.filter(num => num <= 1000);
  
  return filteredNums.reduce((a, b) => a + b, 0);
}

/** Escapes special regex characters */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { add };
