function add(numbers) {
    if (!numbers) return 0;
    
    const delimiters = [',', '\n'];
    
    // Handle custom delimiters
    if (numbers.startsWith('//')) {
        const newlineIndex = numbers.indexOf('\n');
        delimiters.push(...numbers.substring(2, newlineIndex).split(';'));
        numbers = numbers.substring(newlineIndex + 1);
    }

    return numbers
        .split(new RegExp(`[${delimiters.join('')}]`))
        .map(x => {
            const num = parseInt(x.trim(), 10);
            if (isNaN(num)) throw new Error(`Invalid number: ${x}`);
            if (num < 0) throw new Error('Negative numbers not allowed');
            return num;
        })
        .reduce((a, b) => a + b, 0);
}

module.exports = { add };
