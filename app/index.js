const http = require('http');
const qs = require('querystring');
const calculator = require('./calculator');

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { numbers } = qs.parse(body);
                const result = calculator.add(numbers);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`<h1>Result: ${result}</h1>`);
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'text/html' });
                res.end(`<h1>Error: ${error.message}</h1>`);
            }
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
                <body>
                    <h1>Advanced Calculator</h1>
                    <form method="post">
                        <label>Numbers: 
                            <input type="text" name="numbers" placeholder="e.g., 1,2,3 or //;\n1;2;3">
                        </label>
                        <button type="submit">Add</button>
                    </form>
                    <p>Features: Supports custom delimiters (e.g., //;\n1;2), negatives validation, newlines</p>
                </body>
            </html>
        `);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => 
    console.log(`Server running at http://localhost:${PORT}`)
);
