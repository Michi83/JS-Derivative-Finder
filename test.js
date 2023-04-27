let write = (message = "&nbsp;", color = "blue") => {
    message = `<div style=\"color: ${color}\">${message}</div>`
    document.body.innerHTML += message
}

let testDerive = (expression, expected) => {
    try {
        let result = derive(expression)
        let message = `${expression} &xrarr; ${result}`
        let color
        if (result == expected) {
            color = "green"
        } else {
            message += ` (expected: ${expected})`
            color = "red"
        }
        write(message, color)
    } catch (e) {
        let message = `${expression} &xrarr; ERROR: ${e} (expected: ${expected})`
        write(message, "red")
    }
}

let testSimplify = (expression, expected) => {
    try {
        let result = unparse(simplify(parse(expression)))
        let message = `${expression} &xrarr; ${result}`
        let color
        if (result == expected) {
            color = "green"
        } else {
            message += ` (expected: ${expected})`
            color = "red"
        }
        write(message, color)
    } catch (e) {
        let message = `${expression} &xrarr; ERROR: ${e} (expected: ${expected})`
        write(message, "red")
    }
}

write("Basic rules")
testDerive("c", "0")
testDerive("x", "1")
testDerive("f(x) + g(x)", "f'(x) + g'(x)")
testDerive("f(x) - g(x)", "f'(x) - g'(x)")
testDerive("f(x) * g(x)", "f'(x) * g(x) + f(x) * g'(x)")
testDerive("f(x) / g(x)", "(f'(x) * g(x) - f(x) * g'(x)) / g(x)^2")
testDerive("f(g(x))", "f'(g(x)) * g'(x)")
write()
write("Powers")
testDerive("f(x)^c", "c * f(x)^(c - 1) * f'(x)")
testDerive("c^f(x)", "c^f(x) * ln(c) * f'(x)")
testDerive("f(x)^g(x)", "f(x)^g(x) * (f'(x) * g(x) / f(x) + g'(x) * ln(f(x)))")
write()
write("Basic functions")
testDerive("sign(f(x))", "0")
testDerive("abs(f(x))", "sign(f(x)) * f'(x)")
testDerive("sqrt(f(x))", "f'(x) / (2 * sqrt(f(x)))")
testDerive("exp(f(x))", "exp(f(x)) * f'(x)")
testDerive("ln(f(x))", "f'(x) / f(x)")
write()
write("Trigonometry")
testDerive("sin(f(x))", "cos(f(x)) * f'(x)")
testDerive("cos(f(x))", "-sin(f(x)) * f'(x)")
testDerive("tan(f(x))", "sec(f(x))^2 * f'(x)")
testDerive("cot(f(x))", "-csc(f(x))^2 * f'(x)")
testDerive("sec(f(x))", "sec(f(x)) * tan(f(x)) * f'(x)")
testDerive("csc(f(x))", "-csc(f(x)) * cot(f(x)) * f'(x)")
write()
write("Inverse trigonometry")
testDerive("asin(f(x))", "f'(x) / sqrt(1 - f(x)^2)")
testDerive("acos(f(x))", "-f'(x) / sqrt(1 - f(x)^2)")
testDerive("atan(f(x))", "f'(x) / (f(x)^2 + 1)")
testDerive("acot(f(x))", "-f'(x) / (f(x)^2 + 1)")
testDerive("asec(f(x))", "f'(x) / (abs(f(x)) * sqrt(f(x)^2 - 1))")
testDerive("acsc(f(x))", "-f'(x) / (abs(f(x)) * sqrt(f(x)^2 - 1))")
write()
write("Hyperbolic functions")
testDerive("sinh(f(x))", "cosh(f(x)) * f'(x)")
testDerive("cosh(f(x))", "sinh(f(x)) * f'(x)")
testDerive("tanh(f(x))", "sech(f(x))^2 * f'(x)")
testDerive("coth(f(x))", "-csch(f(x))^2 * f'(x)")
testDerive("sech(f(x))", "-sech(f(x)) * tanh(f(x)) * f'(x)")
testDerive("csch(f(x))", "-csch(f(x)) * coth(f(x)) * f'(x)")
write()
write("Inverse hyperbolic functions")
testDerive("asinh(f(x))", "f'(x) / sqrt(f(x)^2 + 1)")
testDerive("acosh(f(x))", "f'(x) / sqrt(f(x)^2 - 1)")
testDerive("atanh(f(x))", "f'(x) / (1 - f(x)^2)")
testDerive("acoth(f(x))", "f'(x) / (1 - f(x)^2)")
testDerive("asech(f(x))", "-f'(x) / (abs(f(x)) * sqrt(1 - f(x)^2))")
testDerive("acsch(f(x))", "-f'(x) / (abs(f(x)) * sqrt(f(x)^2 + 1))")
write()
write("Simplifications")
testSimplify("2 + 3", "5")
testSimplify("x + 0", "x")
testSimplify("0 + x", "x")
testSimplify("2 - 3", "-1")
testSimplify("x - 0", "x")
testSimplify("0 - x", "-x")
testSimplify("2 * 3", "6")
testSimplify("x * 0", "0")
testSimplify("x * 1", "x")
testSimplify("x * -1", "-x")
testSimplify("0 * x", "0")
testSimplify("1 * x", "x")
testSimplify("-1 * x", "-x")
testSimplify("x / 1", "x")
testSimplify("x / -1", "-x")
testSimplify("0 / x", "0")
testSimplify("2^3", "8")
testSimplify("x^0", "1")
testSimplify("x^1", "x")
testSimplify("0^x", "0")
testSimplify("1^x", "1")
testSimplify("exp(0)", "1")
testSimplify("exp(1)", "e")
testSimplify("ln(1)", "0")
testSimplify("ln(e)", "1")
testSimplify("sqrt(0)", "0")
testSimplify("sqrt(1)", "1")
