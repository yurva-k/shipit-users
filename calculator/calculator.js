// calculator.js

// Global state
let display = document.getElementById("display");
let currentInput = "";
let operator = "";
let previousInput = "";
let memory = 0;
let isNewCalculation = false;

const MAX_MEMORY = 1e15;
const MIN_MEMORY = -1e15;

// --- Helpers ---
function isOperator(value) {
  return ["+", "-", "*", "/"].includes(value);
}

function updateDisplay() {
  if (currentInput === "") {
    display.value = previousInput || "0";
  } else {
    display.value = currentInput;
  }
}

function clearDisplay() {
  currentInput = "";
  operator = "";
  previousInput = "";
  isNewCalculation = false;
  display.value = "0";
}

function deleteLast() {
  if (currentInput.length > 0) {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === "") currentInput = "0";
    updateDisplay();
  }
}

// --- Core input handler ---
function appendToDisplay(value) {
  if (isNewCalculation && !isOperator(value)) {
    currentInput = "";
    isNewCalculation = false;
  }

  if (isOperator(value)) {
    if (currentInput === "" && value === "-") {
      // allow negative numbers
      currentInput += value;
    } else if (currentInput !== "") {
      if (previousInput !== "" && operator !== "") {
        calculate();
      }
      operator = value;
      previousInput = currentInput;
      currentInput = "";
    }
  } else {
    // prevent multiple decimals
    if (value === "." && currentInput.includes(".")) return;
    if (currentInput === "0" && value !== ".") {
      currentInput = value; // avoid leading zeros
    } else {
      currentInput += value;
    }
  }

  updateDisplay();
}

// --- Calculation ---
function calculate() {
  if (previousInput === "" || currentInput === "" || operator === "") return;

  let prev = parseFloat(previousInput);
  let current = parseFloat(currentInput);
  let result;

  switch (operator) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "*":
      result = prev * current;
      break;
    case "/":
      if (current === 0) {
        display.value = "Error";
        currentInput = "";
        previousInput = "";
        operator = "";
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }

  // Round to avoid floating point issues
  result = Math.round(result * 1e10) / 1e10;

  currentInput = result.toString();
  operator = "";
  previousInput = currentInput; // keep result for chaining
  isNewCalculation = true;
  updateDisplay();
}

// --- Memory functions ---
function checkMemoryBounds() {
  if (memory > MAX_MEMORY) {
    memory = MAX_MEMORY;
    display.value = "Memory Overflow";
  } else if (memory < MIN_MEMORY) {
    memory = MIN_MEMORY;
    display.value = "Memory Underflow";
  }
}

function memoryStore() {
  memory = parseFloat(display.value) || 0;
  checkMemoryBounds();
}

function memoryRecall() {
  currentInput = memory.toString();
  updateDisplay();
}

function memoryClear() {
  memory = 0;
}

function memoryAdd() {
  memory += parseFloat(display.value) || 0;
  checkMemoryBounds();
}

// --- Init ---
window.onload = function () {
  display.value = "0";

  // Keyboard support
  document.addEventListener("keydown", function (event) {
    if (!isNaN(event.key)) {
      appendToDisplay(event.key);
    } else if (["+", "-", "*", "/"].includes(event.key)) {
      appendToDisplay(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
      event.preventDefault();
      calculate();
    } else if (event.key === "Backspace") {
      deleteLast();
    } else if (event.key === "Escape") {
      clearDisplay();
    } else if (event.key === ".") {
      appendToDisplay(".");
    }
  });
};
