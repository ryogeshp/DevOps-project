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
      <title>Advanced Calculator</title>
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Arial', sans-serif;
          background: #f0f2f5;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .calculator {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 450px;
          overflow: hidden;
        }
        .calculator-header {
          background: #0078d4;
          color: white;
          padding: 12px;
          text-align: center;
          font-size: 22px;
          font-weight: bold;
        }
        .display {
          padding: 15px;
          background: #fafafa;
          text-align: right;
          border-bottom: 1px solid #e0e0e0;
        }
        #expression {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 26px;
          text-align: right;
          padding: 5px;
          color: #333;
          outline: none;
        }
        #result {
          font-size: 20px;
          color: ${isError ? '#dc3545' : '#28a745'};
          min-height: 25px;
        }
        .keypad {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          padding: 15px;
        }
        button {
          border: none;
          padding: 15px;
          font-size: 18px;
          border-radius: 5px;
          cursor: pointer;
          background: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.1s ease;
        }
        button:hover {
          background: #f5f5f5;
        }
        button:active {
          transform: scale(0.95);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .operator {
          background: #0078d4;
          color: white;
        }
        .operator:hover {
          background: #005ea2;
        }
        .equals {
          background: #28a745;
          color: white;
          grid-column: span 2;
        }
        .equals:hover {
          background: #218838;
        }
        .clear {
          background: #dc3545;
          color: white;
        }
        .clear:hover {
          background: #c82333;
        }
        .memory {
          background: #17a2b8;
          color: white;
        }
        .memory:hover {
          background: #138496;
        }
        .backspace {
          background: #6c757d;
          color: white;
        }
        .backspace:hover {
          background: #5a6268;
        }
        .history {
          max-height: 120px;
          overflow-y: auto;
          padding: 10px;
          background: #fff;
          border-top: 1px solid #e0e0e0;
          font-size: 13px;
          color: #555;
        }
        .history-item {
          padding: 5px 0;
          cursor: pointer;
        }
        .history-item:hover {
          background: #f8f9fa;
        }
        .clear-history {
          background: #dc3545;
          color: white;
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-bottom: 10px;
        }
        .clear-history:hover {
          background: #c82333;
        }
        @media (max-width: 400px) {
          .calculator {
            max-width: 100%;
          }
          button {
            padding: 12px;
            font-size: 16px;
          }
          #expression {
            font-size: 22px;
          }
          #result {
            font-size: 18px;
          }
        }
      </style>
    </head>
    <body>
      <div class="calculator">
        <div class="calculator-header">Advanced Calculator</div>
        <div class="display">
          <input type="text" id="expression" value="${currentExpression}" placeholder="0" autocomplete="off">
          <div id="result">${result ? (isError ? `Error: ${result}` : `= ${result}`) : ''}</div>
        </div>
        <div class="keypad">
          <button class="memory" onclick="memoryPlus()">M+</button>
          <button class="memory" onclick="memoryMinus()">M-</button>
          <button class="memory" onclick="memoryRecall()">MR</button>
          <button class="memory" onclick="memoryClear()">MC</button>
          <button class="clear" onclick="clearDisplay()">C</button>
          <button class="backspace" onclick="backspace()">←</button>
          <button class="operator" onclick="appendToDisplay('(')">(</button>
          <button class="operator" onclick="appendToDisplay(')')">)</button>
          <button onclick="appendToDisplay('7')">7</button>
          <button onclick="appendToDisplay('8')">8</button>
          <button onclick="appendToDisplay('9')">9</button>
          <button class="operator" onclick="appendToDisplay('/')">/</button>
          <button onclick="appendToDisplay('4')">4</button>
          <button onclick="appendToDisplay('5')">5</button>
          <button onclick="appendToDisplay('6')">6</button>
          <button class="operator" onclick="appendToDisplay('*')">×</button>
          <button onclick="appendToDisplay('1')">1</button>
          <button onclick="appendToDisplay('2')">2</button>
          <button onclick="appendToDisplay('3')">3</button>
          <button class="operator" onclick="appendToDisplay('-')">-</button>
          <button onclick="appendToDisplay('0')">0</button>
          <button onclick="appendToDisplay('.')">.</button>
          <button class="operator" onclick="appendToDisplay('^')">^</button>
          <button class="operator" onclick="appendToDisplay('+')">+</button>
          <button class="equals" onclick="calculate()">=</button>
        </div>
        <div class="history" id="history">
          <button class="clear-history" onclick="clearHistory()">Clear History</button>
          ${result && !isError ? `<div class="history-item" onclick="loadExpression('${currentExpression}')">${currentExpression} = ${result}</div>` : ''}
        </div>
      </div>
      <script>
        const display = document.getElementById('expression');
        const resultDisplay = document.getElementById('result');
        const history = document.getElementById('history');
        let historyEntries = ${result && !isError ? `[{expression: '${currentExpression}', result: ${result}}]` : '[]'};
        let memory = 0;
        const buttons = document.querySelectorAll('.keypad button');

        const keyMap = {
          '+': '+',
          '-': '-',
          '*': '×',
          '/': '/',
          '^': '^',
          '(': '(',
          ')': ')',
          '.': '.',
          'Enter': '=',
          'Backspace': '←',
          'Escape': 'C'
        };

        function appendToDisplay(value) {
          display.value += value;
          resultDisplay.textContent = '';
          validateInput(display.value);
          display.focus();
        }

        function clearDisplay() {
          display.value = '';
          resultDisplay.textContent = '';
          display.focus();
        }

        function backspace() {
          display.value = display.value.slice(0, -1);
          resultDisplay.textContent = '';
          validateInput(display.value);
          display.focus();
        }

        function validateInput(input) {
          if (!input) return true;
          if (!/^[0-9+\-*\/^.()\s]+$/.test(input)) {
            resultDisplay.style.color = '#dc3545';
            resultDisplay.textContent = 'Error: Invalid input';
            return false;
          }
          const openParens = (input.match(/\(/g) || []).length;
          const closeParens = (input.match(/\)/g) || []).length;
          if (openParens !== closeParens) {
            resultDisplay.style.color = '#dc3545';
            resultDisplay.textContent = 'Error: Mismatched parentheses';
            return false;
          }
          if (/([+\-*\/^]){2,}/.test(input)) {
            resultDisplay.style.color = '#dc3545';
            resultDisplay.textContent = 'Error: Consecutive operators';
            return false;
          }
          return true;
        }

        function calculate() {
          const expression = display.value.trim();
          if (!expression || !validateInput(expression)) return;
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

        function memoryPlus() {
          if (display.value && validateInput(display.value)) {
            const form = document.createElement('form');
            form.method = 'POST';
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'expression';
            input.value = display.value;
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
          }
        }

        function memoryMinus() {
          if (display.value && validateInput(display.value)) {
            const form = document.createElement('form');
            form.method = 'POST';
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'expression';
            input.value = `-${display.value}`;
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
          }
        }

        function memoryRecall() {
          if (memory) {
            display.value = memory.toString();
            resultDisplay.textContent = '';
            validateInput(display.value);
          }
        }

        function memoryClear() {
          memory = 0;
        }

        function clearHistory() {
          historyEntries = [];
          history.innerHTML = '<button class="clear-history" onclick="clearHistory()">Clear History</button>';
        }

        function loadExpression(expression) {
          display.value = expression;
          resultDisplay.textContent = '';
          validateInput(display.value);
          display.focus();
        }

        function updateHistory(expression, result) {
          historyEntries.unshift({ expression, result });
          if (historyEntries.length > 10) historyEntries.pop();
          history.innerHTML = '<button class="clear-history" onclick="clearHistory()">Clear History</button>' +
            historyEntries.map(entry => `<div class="history-item" onclick="loadExpression('${entry.expression}')">${entry.expression} = ${entry.result}</div>`).join('');
        }

        function handleKey(key) {
          switch (key) {
            case '0': case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '8': case '9':
            case '+': case '-': case '*': case '/': case '^':
            case '(': case ')': case '.':
              appendToDisplay(key);
              break;
            case 'Enter':
              calculate();
              break;
            case 'Backspace':
              backspace();
              break;
            case 'Escape':
              clearDisplay();
              break;
          }
        }

        function highlightButton(key) {
          const buttonText = keyMap[key] || key;
          const button = Array.from(buttons).find(btn => btn.textContent === buttonText);
          if (button) {
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 100);
          }
        }

        document.addEventListener('keydown', (e) => {
          const key = e.key;
          if (key in keyMap || (key >= '0' && key <= '9')) {
            e.preventDefault();
            handleKey(key);
            highlightButton(key);
          }
        });

        display.addEventListener('input', () => validateInput(display.value));
        window.onload = () => {
          display.focus();
          ${result && !isError ? `updateHistory('${currentExpression}', ${result});` : ''}
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
