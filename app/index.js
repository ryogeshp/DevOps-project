const http = require('http');
const qs = require('querystring');
const Calculator = require('./calculator');

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { expression } = qs.parse(body);
        const result = Calculator.calculate(expression);
        sendResponse(res, 200, `${expression} = ${result}`);
      } catch (error) {
        sendResponse(res, 400, `Error: ${error.message}`);
      }
    });
  } else {
    sendCalculatorUI(res);
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
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0;
          padding: 20px;
        }
        .container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 500px;
          padding: 30px;
          text-align: center;
        }
        h2 {
          color: #2c3e50;
          margin-bottom: 20px;
          font-size: 24px;
        }
        .result {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          font-size: 22px;
          font-weight: bold;
          color: #3498db;
          min-height: 60px;
          word-wrap: break-word;
        }
        .btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 12px 25px;
          font-size: 16px;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: bold;
          box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        }
        .btn:hover {
          background: #2980b9;
          transform: translateY(-2px);
          box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
        }
        .error {
          color: #e74c3c;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Calculator Result</h2>
        <div class="result ${status === 400 ? 'error' : ''}">${message}</div>
        <button onclick="window.location.href='/'" class="btn">Back to Calculator</button>
      </div>
    </body>
    </html>
  `);
}

function sendCalculatorUI(res) {
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
      <title>Professional Scientific Calculator</title>
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .calculator {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 500px;
          overflow: hidden;
        }
        header {
          background: #2c3e50;
          color: white;
          padding: 20px;
          text-align: center;
        }
        h1 {
          font-size: 24px;
          font-weight: 600;
        }
        .display {
          padding: 20px;
          background: #f8f9fa;
          text-align: right;
        }
        #expression {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 24px;
          text-align: right;
          padding: 10px 5px;
          color: #2c3e50;
          font-weight: bold;
          outline: none;
        }
        .instructions {
          padding: 15px 20px;
          background: #eef2f7;
          font-size: 14px;
          color: #5c6b7a;
        }
        .keypad {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          padding: 20px;
        }
        button {
          border: none;
          padding: 15px;
          font-size: 18px;
          border-radius: 10px;
          cursor: pointer;
          background: white;
          box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease;
          font-weight: 500;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
        }
        button:active {
          transform: translateY(1px);
        }
        .number {
          background: #f8f9fa;
        }
        .operator {
          background: #3498db;
          color: white;
        }
        .equals {
          background: #2ecc71;
          color: white;
          grid-column: span 2;
        }
        .clear {
          background: #e74c3c;
          color: white;
        }
        .paren {
          background: #f39c12;
          color: white;
        }
        .exponent {
          background: #9b59b6;
          color: white;
        }
        .negative {
          background: #34495e;
          color: white;
        }
        .examples {
          padding: 15px 20px;
          background: #eef2f7;
          font-size: 14px;
          color: #5c6b7a;
          border-top: 1px solid #e0e6ed;
        }
        .examples h3 {
          margin-bottom: 10px;
          color: #2c3e50;
        }
        .examples ul {
          padding-left: 20px;
        }
        .examples li {
          margin-bottom: 5px;
        }
        .examples code {
          background: #e0e6ed;
          padding: 2px 5px;
          border-radius: 4px;
          font-family: monospace;
        }
      </style>
    </head>
    <body>
      <div class="calculator">
        <header>
          <h1>Professional Scientific Calculator</h1>
        </header>
        
        <div class="display">
          <input type="text" id="expression" placeholder="Enter expression" autocomplete="off">
        </div>
        
        <div class="instructions">
          <p>Enter mathematical expressions using numbers and operators (+, -, *, /, ^). Use parentheses for grouping.</p>
        </div>
        
        <div class="keypad">
          <button class="clear" onclick="clearDisplay()">C</button>
          <button class="paren" onclick="appendToDisplay('(')">(</button>
          <button class="paren" onclick="appendToDisplay(')')">)</button>
          <button class="operator" onclick="appendToDisplay('/')">/</button>
          
          <button class="number" onclick="appendToDisplay('7')">7</button>
          <button class="number" onclick="appendToDisplay('8')">8</button>
          <button class="number" onclick="appendToDisplay('9')">9</button>
          <button class="operator" onclick="appendToDisplay('*')">×</button>
          
          <button class="number" onclick="appendToDisplay('4')">4</button>
          <button class="number" onclick="appendToDisplay('5')">5</button>
          <button class="number" onclick="appendToDisplay('6')">6</button>
          <button class="operator" onclick="appendToDisplay('-')">-</button>
          
          <button class="number" onclick="appendToDisplay('1')">1</button>
          <button class="number" onclick="appendToDisplay('2')">2</button>
          <button class="number" onclick="appendToDisplay('3')">3</button>
          <button class="operator" onclick="appendToDisplay('+')">+</button>
          
          <button class="negative" onclick="appendToDisplay('-')">(-)</button>
          <button class="number" onclick="appendToDisplay('0')">0</button>
          <button class="number" onclick="appendToDisplay('.')">.</button>
          <button class="exponent" onclick="appendToDisplay('^')">^</button>
          
          <button class="equals" onclick="calculate()">=</button>
        </div>
        
        <div class="examples">
          <h3>Examples:</h3>
          <ul>
            <li>Basic: <code>2 + 3 * 4</code></li>
            <li>Negative: <code>-5 + 3 * -2</code></li>
            <li>Exponents: <code>2^3 + 4^2</code></li>
            <li>Parentheses: <code>(2 + 3) * 4</code></li>
            <li>Complex: <code>2 * (3 + 4) / (1.5 - 0.5)</code></li>
          </ul>
        </div>
      </div>
      
      <script>
        const display = document.getElementById('expression');
        
        function appendToDisplay(value) {
          display.value += value;
          display.focus();
        }
        
        function clearDisplay() {
          display.value = '';
          display.focus();
        }
        
        function calculate() {
          const expression = display.value.trim();
          if (!expression) return;
          
          const form = document.createElement('form');
          form.method = 'POST';
          
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'expression';
          input.value = expression;
          
          form.appendChild(input);
          document.body.appendChild(form);
          form.submit();
        }
        
        // Handle keyboard input
        display.addEventListener('keyup', (e) => {
          if (e.key === 'Enter') {
            calculate();
          }
        });
        
        // Allow only valid characters
        display.addEventListener('input', (e) => {
          display.value = display.value.replace(/[^0-9+\-*\/^.()]/g, '');
        });
        
        // Focus the input field when page loads
        window.onload = function() {
          display.focus();
        };
      </script>
    </body>
    </html>
  `);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Calculator running at http://localhost:${PORT}`);
});
