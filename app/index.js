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
  res.writeHead(status, {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-store'
  });
  
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Calculator Result</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h2 { color: #333; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        .btn {
          display: inline-block;
          padding: 10px 20px;
          background: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2 class="${status === 200 ? 'success' : 'error'}">${message}</h2>
        <a href="/" class="btn">Back to Calculator</a>
      </div>
    </body>
    </html>
  `);
}

function sendForm(res) {
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-store'
  });
  
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Professional Calculator</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          text-align: center;
          color: #333;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }
        input[type="text"] {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        button {
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 20px;
          font-size: 16px;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
        }
        .instructions {
          margin-top: 30px;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 4px;
        }
        code {
          background: #e9ecef;
          padding: 2px 6px;
          border-radius: 3px;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin-bottom: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Professional Calculator</h1>
        
        <form method="post">
          <div class="form-group">
            <label for="numbers">Enter numbers:</label>
            <input type="text" id="numbers" name="numbers" 
                   placeholder="e.g., 1,2,3 or //;\n1;2;3" required>
          </div>
          <button type="submit">Calculate Sum</button>
        </form>
        
        <div class="instructions">
          <h3>How to use:</h3>
          <ul>
            <li>Basic: <code>1,2,3</code> = 6</li>
            <li>Custom delimiter: <code>//;\n1;2;3</code> = 6</li>
            <li>Multiple delimiters: <code>//%|;\n1%2;3</code> = 6</li>
            <li>Newlines: <code>1\n2,3</code> = 6</li>
            <li>Spaces are allowed: <code>1, 2, 3</code> = 6</li>
            <li>Numbers larger than 1000 are ignored: <code>2,1001</code> = 2</li>
            <li>Negative numbers show error: <code>1,-2,3</code> = Error</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Calculator running at http://localhost:${PORT}`);
});
