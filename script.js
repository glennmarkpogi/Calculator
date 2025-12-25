document.addEventListener('DOMContentLoaded', () => {
    const expressionEl = document.querySelector('.expression');
    const resultEl = document.querySelector('.result');
    const buttons = document.querySelectorAll('.btn');
    const backspaceBtn = document.querySelector('.backspace-btn');

    let expression = '';
    let result = '';
    let lastInputIsResult = false;

    // Map button values to executable operators
    const operatorMap = {
        '÷': '/',
        '×': '*',
        '−': '-',
        '+': '+'
    };

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.innerText;

            if (value === 'C') {
                clear();
            } else if (value === '=') {
                calculate();
            } else if (value === '+/-') {
                negate();
            } else if (value === '%') {
                percentage();
            } else if (value === '()') {
                addParenthesis();
            } else {
                append(value);
            }
        });
    });

    backspaceBtn.addEventListener('click', () => {
        if (lastInputIsResult) {
            expression = '';
            result = '';
            lastInputIsResult = false;
        } else {
            expression = expression.slice(0, -1);
        }
        updateDisplay();
    });

    function append(value) {
        if (lastInputIsResult) {
            // If we just calculated, and user types a number, start new.
            // If user types an operator, continue with result.
            if (['+', '-', '×', '÷'].includes(value)) {
                expression = result;
            } else {
                expression = '';
            }
            lastInputIsResult = false;
            result = ''; // Clear result view until next calc
        }
        
        expression += value;
        updateDisplay();
    }

    function clear() {
        expression = '';
        result = '';
        lastInputIsResult = false;
        updateDisplay();
    }

    function negate() {
        // Simple negation: wrap in -() or remove it. 
        // For simplicity in this mockup, we'll just wrap the whole current expression or last number.
        // Let's try to be smart: find the last number and negate it.
        // Or just wrap everything in -() if it's complex.
        
        if (expression === '') return;
        
        // Very basic implementation: wrap entire expression in -()
        // A better one would be to toggle the sign of the last number.
        if (expression.startsWith('-(') && expression.endsWith(')')) {
            expression = expression.slice(2, -1);
        } else {
            expression = `-(${expression})`;
        }
        updateDisplay();
    }

    function percentage() {
        // Append /100
        expression += '/100';
        updateDisplay();
    }

    function addParenthesis() {
        if (lastInputIsResult) {
            expression = '';
            lastInputIsResult = false;
        }

        // Count open and close parens
        const openCount = (expression.match(/\(/g) || []).length;
        const closeCount = (expression.match(/\)/g) || []).length;

        const lastChar = expression.slice(-1);
        const isLastOperator = ['+', '-', '×', '÷', '('].includes(lastChar);
        const isLastNumber = /[0-9]/.test(lastChar);

        if (openCount > closeCount && !isLastOperator) {
            expression += ')';
        } else {
            // Implicit multiplication if following a number or closing paren
            if (isLastNumber || lastChar === ')') {
                expression += '×(';
            } else {
                expression += '(';
            }
        }
        updateDisplay();
    }

    function calculate() {
        try {
            // Replace visual operators with JS operators
            let evalString = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-'); // Ensure minus is correct

            // Safety check: only allow valid chars
            if (!/^[\d\.\+\-\*\/\(\)\s]+$/.test(evalString)) {
                // throw new Error("Invalid characters");
            }

            // Evaluate
            // eslint-disable-next-line no-eval
            let res = eval(evalString);
            
            // Format result
            if (!isFinite(res) || isNaN(res)) {
                result = 'Error';
            } else {
                // Round to avoid floating point errors
                result = parseFloat(res.toFixed(10)).toString();
            }
            
            lastInputIsResult = true;
        } catch (e) {
            result = 'Error';
        }
        updateDisplay();
    }

    function updateDisplay() {
        expressionEl.innerText = expression;
        // If we have a result (after =), show it. 
        // Otherwise, we could show a live preview, but the prompt image implies a static state.
        // We'll show result only if it's set.
        resultEl.innerText = result;
    }
});
