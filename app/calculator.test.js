// Add these new tests
test('numbers with newline delimiter should work', () => {
    expect(calculator.add('1\n2,3')).toBe(6);
});

test('custom delimiter should work', () => {
    expect(calculator.add('//;\n1;2')).toBe(3);
});

test('negative numbers should throw exception', () => {
    expect(() => calculator.add('1,-2,3')).toThrow('Negative numbers not allowed');
});

test('large numbers should be ignored', () => {
    expect(calculator.add('2,1001')).toBe(2);
});
