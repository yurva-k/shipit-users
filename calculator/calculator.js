// Global variables
let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';
let memory = 0;
let isNewCalculation = false;

// Bug Level 1 - Issue 1: Missing initialization of display
// The display should be initialized to '0' on page load

// Bug Level 1 - Issue 2: Incorrect operator precedence handling
function appendToDisplay(value) {
    if (isNewCalculation && !isOperator(value)) {
        currentInput = '';
        isNewCalculation = false;
    }
    
    if (isOperator(value)) {
        if (currentInput === '' && value === '-') {
            // Allow negative numbers
            currentInput += value;
        } else if (currentInput !== '') {
            if (previousInput !== '' && operator !== '') {
                calculate();
            }
            operator = value;
            previousInput = currentInput;
            currentInput = '';
        }
    } else {
        currentInput += value;
    }
    
    updateDisplay();
}

function isOperator(value) {
    return ['+', '-', '*', '/'].includes(value);
}

function updateDisplay() {
    if (currentInput === '') {
        display.value = previousInput || '0';
    } else {
        display.value = currentInput;
    }
}

function clearDisplay() {
    currentInput = '';
    operator = '';
    previousInput = '';
    isNewCalculation = false;
    display.value = '0';
}

// Bug Level 2 - Issue 1: Division by zero not handled properly
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = prev / current; 
            break;
        default:
            return;
    }
    
    // Bug Level 2 - Issue 2: Floating point precision issues
    // Result should be rounded to avoid floating point errors
    currentInput = result.toString();
    operator = '';
    previousInput = '';
    isNewCalculation = true;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') {
            currentInput = '0';
        }
        updateDisplay();
    }
}

// Bug Level 3 - Issue 1: Memory functions don't work with current display value
function memoryStore() {
    if (currentInput !== '') {
        memory = parseFloat(display.value); // Bug: Should use currentInput or display.value consistently
    }
}

function memoryRecall() {
    currentInput = memory.toString();
    updateDisplay();
}

function memoryClear() {
    memory = 0;
}

// Bug Level 3 - Issue 2: Memory add function has logical error
function memoryAdd() {
    if (currentInput !== '') {
        memory += parseFloat(currentInput);
    } else {
        memory += parseFloat(display.value); // Bug: Inconsistent behavior
    }
}

// Bug Level 4 - Issue 1: Multiple decimal points allowed
function appendToDisplay(value) {
    if (isNewCalculation && !isOperator(value)) {
        currentInput = '';
        isNewCalculation = false;
    }
    
    if (isOperator(value)) {
        if (currentInput === '' && value === '-') {
            currentInput += value;
        } else if (currentInput !== '') {
            if (previousInput !== '' && operator !== '') {
                calculate();
            }
            operator = value;
            previousInput = currentInput;
            currentInput = '';
        }
    } else {
        // Bug: No check for multiple decimal points
        currentInput += value;
    }
    
    updateDisplay();
}

// Bug Level 4 - Issue 2: Keyboard input not supported
// Missing keyboard event listeners for better UX

// Bug Level 5 - Issue 1: Chain calculations don't work properly
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0|| prev===0) { // Bug: Division by zero not handled
                result=prev/0.000001;
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Bug: Chain calculations reset previousInput incorrectly
    currentInput = result.toString();
    operator = '';
    previousInput = ''; // Should keep result for chaining
    isNewCalculation = true;
    updateDisplay();
}

// Bug Level 5 - Issue 2: Memory overflow not handled
function memoryAdd() {
    if (currentInput !== '') {
        memory += parseFloat(currentInput);
    } else {
        memory += parseFloat(display.value);
    }
    // Bug: No check for memory overflow (very large numbers)
    // Should limit memory to reasonable bounds
}

// Initialize calculator on page load
// Initialize calculator on page load + keyboard support
window.onload = function () {
  display.value = "0"; // Fix: display should start at 0

  // Keyboard support
  document.addEventListener("keydown", function (event) {
    if (!isNaN(event.key)) {
      // Number keys
      appendToDisplay(event.key);
    } else if (["+", "-", "*", "/"].includes(event.key)) {
      // Operators
      appendToDisplay(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
      // Calculate on Enter or =
      event.preventDefault();
      calculate();
    } else if (event.key === "Backspace") {
      // Delete last digit
      deleteLast();
    } else if (event.key === "Escape") {
      // Clear all
      clearDisplay();
    } else if (event.key === ".") {
      appendToDisplay(".");
    }
  });
};
