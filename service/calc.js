const expressionReg = new RegExp('^\s*([-+]?)(\d+)(?:\s*([-+*\/])\s*((?:\s[-+])?\d+)\s*)+$')
const calculate = (expression) => {
    expression = expression.replace('x', '*').replace(/\s/g,'');
    try{
        result = expression.match(expressionReg);
    }catch(e){
        throw new Error(`expression ${expression} is invalid`);
    }
    return calc(expression)
}

function calc(s) {
    const stack = []
    let sign = '+'
    let num = 0
    for(i =0; i< s.length; i++){
        c = s[i]
        if(isDigit(c))
            num = Number(c);
        if(i + 1 == s.length || (c == '+' || c == '-' || c == '*' || c == '/')){
            if(sign == '+')
                stack.push(num)
            else if(sign == '-')
                stack.push(-num)
            else if(sign == '*')
                stack[stack.length-1] = stack[stack.length-1]*num
            else if(sign == '/')
                stack[stack.length-1] = Number(stack[stack.length-1]/Number(num))
            sign = c
            num = 0
        }
    }
    return stack.reduce((a,b) => a+b, 0)
}

function isDigit(c){
    return (c.charCodeAt(0) >= '0'.charCodeAt(0) && c.charCodeAt(0) <= '9'.charCodeAt(0));
}
 
function value(c){
    return (c.charCodeAt(0) - '0'.charCodeAt(0));
}

module.exports = {
    calculate
}