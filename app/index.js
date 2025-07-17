const http = require('http');
const qs = require('querystring');
const Calculator = require('./calculator');

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { expression } = qs.parse(body);
      try {
        const result = Calculator.calculate(expression);
        sendCalculatorUI(res, expression, result);
      } catch (error) {
        sendCalculatorUI(res, expression, error.message, true);
      }
    });
  } else {
    sendCalculatorUI(res);
  }
});

function sendCalculatorUI(res, currentExpression = '', result = '', isError = false) {
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
      <title>Calculator</title>
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
        .result {
          font-size: 18px;
          color: ${isError ? '#e74c3c' : '#2ecc71'};
          min-height: 25px;
          padding: 5px;
          word-wrap: break-word;
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
      </style>
    </head>
    <body>
      <div class="calculator">
        <header>
          <h1>Professional Calculator</h1>
        </header>
        
        <div class="display">
          <input type="text" id="expression" value="${currentExpression}" placeholder="Enter expression" autocomplete="off">
          <div class="result" id="result">${result ? (isError ? result : `= ${result}`) : ''}</div>
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
      </div>
      
      <script>
        const display = document.getElementById('expression');
        const resultDisplay = document.getElementById('result');
        
        function appendToDisplay(value) {
          display.value += value;
          display.focus();
          resultDisplay.textContent = '';
        }
        
        function clearDisplay() {
          display.value = '';
          resultDisplay.textContent = '';
          display.focus();
        }
        
        function calculate() {
          const expression = display.value.trim();
          if (!expression) return;
          
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = '/';
          
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
