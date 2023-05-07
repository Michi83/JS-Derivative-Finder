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
testDerive("c^f(x)", "c^f(x) * f'(x) * ln(c)")
testDerive("f(x)^g(x)", "f(x)^g(x) * (f'(x) * g(x) / f(x) + g'(x) * ln(f(x)))")
write()
write("Basic functions")
testDerive("exp(f(x))", "exp(f(x)) * f'(x)")
testDerive("ln(f(x))", "f'(x) / f(x)")
testDerive("log10(f(x))", "f'(x) / (f(x) * ln(10))")
testDerive("log2(f(x))", "f'(x) / (f(x) * ln(2))")
testDerive("sqrt(f(x))", "f'(x) / (2 * sqrt(f(x)))")
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
testDerive("asin(f(x))", "sec(asin(f(x))) * f'(x)")
testDerive("acos(f(x))", "-csc(acos(f(x))) * f'(x)")
testDerive("atan(f(x))", "cos(atan(f(x)))^2 * f'(x)")
testDerive("acot(f(x))", "-sin(acot(f(x)))^2 * f'(x)")
testDerive("asec(f(x))", "cos(asec(f(x))) * cot(asec(f(x))) * f'(x)")
testDerive("acsc(f(x))", "-sin(acsc(f(x))) * tan(acsc(f(x))) * f'(x)")
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
testDerive("asinh(f(x))", "sech(asinh(f(x))) * f'(x)")
testDerive("acosh(f(x))", "csch(acosh(f(x))) * f'(x)")
testDerive("atanh(f(x))", "cosh(atanh(f(x)))^2 * f'(x)")
testDerive("acoth(f(x))", "-sinh(acoth(f(x)))^2 * f'(x)")
testDerive("asech(f(x))", "-cosh(asech(f(x))) * coth(asech(f(x))) * f'(x)")
testDerive("acsch(f(x))", "-sinh(acsch(f(x))) * tanh(acsch(f(x))) * f'(x)")
write()
write("Simplifications")
testSimplify("2 + 3", "5")
testSimplify("x + 0", "x")
testSimplify("0 + x", "x")
testSimplify("x + x", "2 * x")
testSimplify("x + -3", "x - 3")
testSimplify("x + -y", "x - y")
testSimplify("2 - 3", "-1")
testSimplify("x - 0", "x")
testSimplify("0 - x", "-x")
testSimplify("x - x", "0")
testSimplify("x - -3", "x + 3")
testSimplify("x - -y", "x + y")
testSimplify("2 * a + a", "3 * a")
testSimplify("3 * a - a", "2 * a")
testSimplify("-a + a", "0")
testSimplify("2 * 3", "6")
testSimplify("x * 0", "0")
testSimplify("x * 1", "x")
testSimplify("x * -1", "-x")
testSimplify("0 * x", "0")
testSimplify("1 * x", "x")
testSimplify("-1 * x", "-x")
testSimplify("x * x", "x^2")
testSimplify("a * b + 2 * a * b", "3 * a * b")
testSimplify("x / 1", "x")
testSimplify("x / -1", "-x")
testSimplify("0 / x", "0")
testSimplify("x / x", "1")
testSimplify("(a / b) / (c / d)", "a * d / (b * c)")
testSimplify("15 / 6", "5 / 2")
testSimplify("-15 / 6", "-5 / 2")
testSimplify("15 / -6", "-5 / 2")
testSimplify("-15 / -6", "5 / 2")
testSimplify("0 / 6", "0")
testSimplify("-0 / 6", "0")
testSimplify("0 / -6", "0")
testSimplify("-0 / -6", "0")
testSimplify("15 / 0", "0 / 0")
testSimplify("-15 / -0", "0 / 0")
testSimplify("15 / 0", "0 / 0")
testSimplify("-15 / -0", "0 / 0")
testSimplify("0 / 0", "0 / 0")
testSimplify("-0 / -0", "0 / 0")
testSimplify("0 / 0", "0 / 0")
testSimplify("-0 / -0", "0 / 0")
testSimplify("a^2 * b / b^2 / a", "a / b")
testSimplify("0^0", "1")
testSimplify("0^3", "0")
testSimplify("0^-3", "0 / 0")
testSimplify("2^0", "1")
testSimplify("2^3", "8")
testSimplify("2^-3", "1 / 8")
testSimplify("(-2)^0", "1")
testSimplify("(-2)^3", "-8")
testSimplify("(-2)^-3", "-1 / 8")
testSimplify("x^0", "1")
testSimplify("x^1", "x")
testSimplify("0^x", "0")
testSimplify("1^x", "1")
testSimplify("--3", "3")
testSimplify("--x", "x")
testSimplify("exp(0)", "1")
testSimplify("exp(1)", "e")
testSimplify("ln(1)", "0")
testSimplify("ln(e)", "1")
testSimplify("log10(1)", "0")
testSimplify("log10(10)", "1")
testSimplify("log2(1)", "0")
testSimplify("log2(2)", "1")
testSimplify("sqrt(0)", "0")
testSimplify("sqrt(1)", "1")
