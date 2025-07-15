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
        sendResponse(res, 200, `Result: ${result}`);
      } catch (error) {
        sendResponse(res, 400, `Error: ${error.message}`);
      }
    });
  } else {
    sendForm(res);
  }
});

function sendResponse(res, status, message) {
  res.writeHead(status, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head>
        <title>Calculator Result</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body class="container mt-5">
        <div class="card">
          <div class="card-body">
            <h2>${message}</h2>
            <a href="/" class="btn btn-primary mt-3">Back to Calculator</a>
          </div>
        </div>
      </body>
    </html>
  `);
}

function sendForm(res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head>
        <title>Advanced Calculator</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
          .container { max-width: 600px; }
          .instructions { background-color: #f8f9fa; border-radius: 5px; padding: 20px; }
        </style>
      </head>
      <body class="container mt-5">
        <h1 class="text-center mb-4">Advanced Calculator</h1>
        <div class="card">
          <div class="card-body">
            <form method="post">
              <div class="mb-3">
                <label for="numbers" class="form-label">Enter numbers:</label>
                <input type="text" class="form-control" id="numbers" name="numbers" 
                       placeholder="e.g., 1,2,3 or //;\n1;2;3">
              </div>
              <button type="submit" class="btn btn-primary w-100">Calculate Sum</button>
            </form>
          </div>
        </div>
        
        <div class="instructions mt-4">
          <h4>How to use:</h4>
          <ul>
            <li>Comma separated values: <code>1,2,3</code> = 6</li>
            <li>Custom delimiters: <code>//;\n1;2</code> = 3</li>
            <li>Multiple delimiters: <code>//%|;\n1%2;3</code> = 6</li>
            <li>Newline support: <code>1\n2,3</code> = 6</li>
            <li>Numbers >1000 are ignored</li>
            <li>Negative numbers will show error</li>
          </ul>
        </div>
      </body>
    </html>
  `);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
