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
      <title>Professional Calculator</title>
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: Arial, sans-serif;
          background: #f5f5f5;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .calculator {
          background: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          overflow: hidden;
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
          color: #333;
          font-weight: bold;
          outline: none;
          margin-bottom: 10px;
        }
        #result {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 20px;
          text-align: right;
          padding: 5px;
          color: ${isError ? '#e74c3c' : '#2ecc71'};
          min-height: 30px;
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
          border-radius: 5px;
          cursor: pointer;
          background: #f8f9fa;
          transition: all 0.2s;
        }
        button:hover {
          background: #e9ecef;
        }
        button:active {
          transform: scale(0.98);
        }
        .operator {
          background: #3498db;
          color: white;
        }
        .operator:hover {
          background: #2980b9;
        }
        .equals {
          background: #2ecc71;
          color: white;
          grid-column: span 2;
        }
        .equals:hover {
          background: #27ae60;
        }
        .clear {
          background: #e74c3c;
          color: white;
        }
        .clear:hover {
          background: #c0392b;
        }
        .paren {
          background: #f39c12;
          color: white;
        }
        .paren:hover {
          background: #e67e22;
        }
        .exponent {
          background: #9b59b6;
          color: white;
        }
        .exponent:hover {
          background: #8e44ad;
        }
        .negative {
          background: #34495e;
          color: white;
        }
        .negative:hover {
          background: #2c3e50;
        }
      </style>
    </head>
    <body>
      <div class="calculator">
        <div class="display">
          <input type="text" id="expression" value="${currentExpression}" placeholder="Enter expression" autocomplete="off">
          <div id="result">${result ? (isError ? result : `= ${result}`) : ''}</div>
        </div>
        
        <div class="keypad">
          <button class="clear" onclick="clearDisplay()">C</button>
          <button class="paren" onclick="appendToDisplay('(')">(</button>
          <button class="paren" onclick="appendToDisplay(')')">)</button>
          <button class="operator" onclick="appendToDisplay('/')">/</button>
          
          <button onclick="appendToDisplay('7')">7</button>
          <button onclick="appendToDisplay('8')">8</button>
          <button onclick="appendToDisplay('9')">9</button>
          <button class="operator" onclick="appendToDisplay('*')">×</button>
          
          <button onclick="appendToDisplay('4')">4</button>
          <button onclick="appendToDisplay('5')">5</button>
          <button onclick="appendToDisplay('6')">6</button>
          <button class="operator" onclick="appendToDisplay('-')">-</button>
          
          <button onclick="appendToDisplay('1')">1</button>
          <button onclick="appendToDisplay('2')">2</button>
          <button onclick="appendToDisplay('3')">3</button>
          <button class="operator" onclick="appendToDisplay('+')">+</button>
          
          <button class="negative" onclick="appendToDisplay('-')">(-)</button>
          <button onclick="appendToDisplay('0')">0</button>
          <button onclick="appendToDisplay('.')">.</button>
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
          
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'expression';
          input.value = expression;
          
          form.appendChild(input);
          document.body.appendChild(form);
          form.submit();
        }
        
        // Handle keyboard input
        display.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            calculate();
          }
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
