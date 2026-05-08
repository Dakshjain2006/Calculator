// ── State ──
let expr      = '';
let justCalc  = false;

// ── DOM refs ──
const resultEl = document.getElementById('result');
const exprEl   = document.getElementById('expr');

// ── Helpers ──
function updateDisplay(val) {
  resultEl.textContent = val;
  resultEl.classList.add('pulse');
  setTimeout(() => resultEl.classList.remove('pulse'), 200);
}

// ── Button handlers ──
function num(n) {
  if (justCalc) { expr = ''; justCalc = false; }
  expr += n;
  // Show the latest number typed
  const match = expr.match(/[\d.]+$/);
  updateDisplay(match ? parseFloat(match[0]) : n);
  exprEl.textContent = '';
}

function op(o) {
  justCalc = false;
  if (expr && '+-*/'.includes(expr.slice(-1))) {
    expr = expr.slice(0, -1); // replace duplicate operator
  }
  expr += o;
  exprEl.textContent = expr;
  const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  updateDisplay(symbols[o] || o);
}

function clearAll() {
  expr = '';
  justCalc = false;
  updateDisplay(0);
  exprEl.textContent = '';
}

function del() {
  expr = expr.slice(0, -1);
  updateDisplay(expr || 0);
  exprEl.textContent = expr;
}

function percent() {
  try {
    const v = eval(expr) / 100;  // eslint-disable-line no-eval
    expr = String(v);
    updateDisplay(v);
  } catch (_) {}
}

function dot() {
  const parts = expr.split(/[+\-*/]/);
  if (!parts[parts.length - 1].includes('.')) {
    expr += '.';
    exprEl.textContent = expr;
  }
}

function calculate() {
  if (!expr) return;
  try {
    exprEl.textContent = expr + ' =';
    // Use Function constructor (safer than eval with strict mode)
    const res  = Function('"use strict"; return (' + expr + ')')();
    const disp = Number.isInteger(res) ? res : parseFloat(res.toFixed(10));
    updateDisplay(disp);
    expr     = String(disp);
    justCalc = true;
  } catch (_) {
    updateDisplay('Error');
    expr = '';
  }
}

// ── Keyboard support ──
document.addEventListener('keydown', (e) => {
  if ('0123456789'.includes(e.key))       num(e.key);
  else if (e.key === '.')                  dot();
  else if (['+', '-', '*', '/'].includes(e.key)) op(e.key);
  else if (e.key === 'Enter' || e.key === '=')   calculate();
  else if (e.key === 'Backspace')          del();
  else if (e.key === 'Escape')             clearAll();
  else if (e.key === '%')                  percent();
});
