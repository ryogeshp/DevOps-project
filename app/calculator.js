/**
 * Adds numbers from a string input with support for custom delimiters
 * @param {string} numbers - String of numbers separated by delimiters
 * @returns {number} Sum of numbers
 * @throws {Error} If invalid input or negative numbers
 */
function add(numbers) {
  if (numbers === undefined || numbers === null || numbers === '') return 0;
  if (typeof numbers !== 'string') throw new Error('Input must be a string');
  
  let delimiters = [',', '\n'];
  let numbersString = numbers;
  
  // Handle custom delimiter
  if (numbers.startsWith('//')) {
    const newlineIndex = numbers.indexOf('\n');
    if (newlineIndex === -1) throw new Error('Invalid custom delimiter format');
    
    const delimiterPart = numbers.substring(2, newlineIndex);
    // Split multiple delimiters separated by semicolon
    const customDelimiters = delimiterPart.split(';');
    delimiters = [...delimiters, ...customDelimiters];
    numbersString = numbers.substring(newlineIndex + 1);
  }
  
  // Create regex pattern to split by delimiters
  const pattern = new RegExp(`[${delimiters.join('')}]+`);
  const tokens = numbersString.split(pattern);
  
  // Parse and validate numbers
  const nums = [];
  const negatives = [];
  
  for (const token of tokens) {
    const trimmed = token.trim();
    if (trimmed === '') continue;
    
    const num = Number(trimmed);
    if (isNaN(num)) throw new Error(`Invalid number: ${trimmed}`);
    
    if (num < 0) negatives.push(num);
    if (num <= 1000) nums.push(num);
  }
  
  // Handle negative numbers
  if (negatives.length > 0) {
    throw new Error(`Negative numbers not allowed: ${negatives.join(', ')}`);
  }
  
  return nums.reduce((sum, num) => sum + num, 0);
}

module.exports = { add };
