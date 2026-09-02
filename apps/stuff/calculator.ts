function add(a: number, b: number): number {
  return a + b;
}
function subtract(a: number, b: number): number {
  return a - b;
}
function multiply(a: number, b: number): number {
  return a * b;
}
function divide(a: number, b: number): number {
  if (b === 0 || a === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}
function power(a: number, b: number): number {
  return Math.pow(a, b);
}
function squareRoot(a: number): number {
  if (a < 0) {
    throw new Error("Cannot take square root of negative number");
  }
  return Math.sqrt(a);
}
function factorial(n: number): number {
  if (n < 0) {
    throw new Error("Cannot take factorial of negative number");
  }
  if (n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
}
const calculator = {
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
};
export default calculator;

const userInput = prompt("Enter a mathematical expression (e.g., 2 + 2):");
if (userInput) {
  try {
    const result = eval(userInput);
    alert(`Result: ${result}`);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}
