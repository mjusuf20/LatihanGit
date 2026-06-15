let display = '0';
let previousValue = null;
let operation = null;
let isEnteringNumber = false;
let isDarkMode = true;

const displayEl = document.getElementById('display');
const themeToggleEl = document.getElementById('themeToggle');

function updateDisplay() {
  displayEl.textContent = display;
  // Auto-scale font size for long numbers
  const length = display.length;
  let fontSize = 72;
  if (length > 9) fontSize = 56;
  if (length > 12) fontSize = 40;
  displayEl.style.fontSize = fontSize + 'px';
}

function inputDigit(digit) {
  if (isEnteringNumber) {
    if (display.length < 9) {
      display = display === '0' ? digit : display + digit;
    }
  } else {
    display = digit;
    isEnteringNumber = true;
  }
  updateDisplay();
}

function inputDecimal() {
  if (!isEnteringNumber) {
    display = '0.';
    isEnteringNumber = true;
  } else if (!display.includes('.')) {
    display += '.';
  }
  updateDisplay();
}

function clearAll() {
  display = '0';
  previousValue = null;
  operation = null;
  isEnteringNumber = false;
  updateDisplay();
}

function toggleSign() {
  const value = parseFloat(display);
  display = formatNumber(value * -1);
  updateDisplay();
}

function percentage() {
  const value = parseFloat(display);
  display = formatNumber(value / 100);
  updateDisplay();
}

function setOperation(op) {
  if (operation !== null && isEnteringNumber) {
    calculate();
  }
  previousValue = parseFloat(display);
  operation = op;
  isEnteringNumber = false;
}

function calculate() {
  if (operation === null || previousValue === null) return;

  const current = parseFloat(display);
  let result = 0;

  switch (operation) {
    case 'add':
      result = previousValue + current;
      break;
    case 'subtract':
      result = previousValue - current;
      break;
    case 'multiply':
      result = previousValue * current;
      break;
    case 'divide':
      if (current !== 0) {
        result = previousValue / current;
      } else {
        display = 'Error';
        updateDisplay();
        setTimeout(clearAll, 1000);
        return;
      }
      break;
    default:
      return;
  }

  display = formatNumber(result);
  operation = null;
  isEnteringNumber = false;
  updateDisplay();
}

function formatNumber(num) {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  return parseFloat(num.toFixed(8)).toString();
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.className = isDarkMode ? 'dark' : 'light';
  themeToggleEl.textContent = isDarkMode ? '☀️' : '🌙';
}

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
  else if (e.key === '.') inputDecimal();
  else if (e.key === '+') setOperation('add');
  else if (e.key === '-') setOperation('subtract');
  else if (e.key === '*') setOperation('multiply');
  else if (e.key === '/') { e.preventDefault(); setOperation('divide'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === '%') percentage();
});
