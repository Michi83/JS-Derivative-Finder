class Token {
    constructor(type, value) {
        this.type = type
        this.value = value
    }

    // Returns true if this token is not x and does not contain x.
    isConstant() {
        if (this.type == "name" && this.value == "x") {
            return false
        }
        if (this.left != undefined && !this.left.isConstant()) {
            return false
        }
        if (this.right != undefined && !this.right.isConstant()) {
            return false
        }
        return true
    }
}

// Breaks an expression string down into tokens.
let tokenize = (expression) => {
    let isLetter = (char) => {
        return char >= "A" && char <= "Z" || char >= "a" && char <= "z"
    }

    let isDigit = (char) => {
        return char >= "0" && char <= "9"
    }

    expression += "\0"
    let tokens = []
    let to = 0
    while (true) {
        let from = to
        if (expression[to] == "\0") {
            // End.
            let token = new Token("end")
            tokens.push(token)
            break
        } else if (expression[to] == " ") {
            // Spaces get skipped.
            to++
            while (expression[to] == " ") {
                to++
            }
        } else if ("()*+-/^".includes(expression[to])) {
            // Single character tokens.
            to++
            let token = new Token(expression[from])
            tokens.push(token)
        } else if (isDigit(expression[to])) {
            // Numbers.
            to++
            while (isDigit(expression[to])) {
                to++
            }
            if (expression[to] == ".") {
                to++
                if (isDigit(expression[to])) {
                    to++
                    while (isDigit(expression[to])) {
                        to++
                    }
                } else {
                    throw "unexpected end of number"
                }
            }
            let value = Number(expression.substring(from, to))
            let token = new Token("number", value)
            tokens.push(token)
        } else if (isLetter(expression[to])) {
            // Names consist of one or more letters, optionally followed by
            // digits, optionally followed by primes.
            to++
            while (isLetter(expression[to])) {
                to++
            }
            while (isDigit(expression[to])) {
                to++
            }
            while (expression[to] == "'") {
                to++
            }
            let value = expression.substring(from, to)
            let token = new Token("name", value)
            tokens.push(token)
        } else {
            // Everything else is an error.
            throw `unexpected character ${expression[to]}`
        }
    }
    return tokens
}

// Builds a syntax tree and returns the root token. For an explanation of the
// algorithm see recursive descent on Wikipedia.
let parse = (expression) => {
    // sum     ::= product {("+" | "-") product}
    // product ::= sign {("*" | "/") sign}
    // sign    ::= ("+" | "-") sign | power
    // power   ::= factor ["^" sign]
    // factor  ::= number | name ["(" sum ")"] | "(" sum ")"
    let sum = () => {
        let token = product()
        while (tokens[0].type == "+" || tokens[0].type == "-") {
            tokens[0].left = token
            token = tokens.shift()
            token.right = product()
        }
        return token
    }

    let product = () => {
        let token = sign()
        while (tokens[0].type == "*" || tokens[0].type == "/") {
            tokens[0].left = token
            token = tokens.shift()
            token.right = sign()
        }
        return token
    }

    let sign = () => {
        if (tokens[0].type == "+") {
            // Unary + gets dropped.
            tokens.shift()
            return sign()
        } else if (tokens[0].type == "-") {
            // Unary - gets its own token type, "~", but this is never shown to
            // the user.
            let token = tokens.shift()
            token.type = "~"
            token.right = sign()
            return token
        } else {
            return power()
        }
    }

    let power = () => {
        // Powers are right associative:
        // a^b^c == a^(b^c)
        let token = factor()
        if (tokens[0].type == "^") {
            tokens[0].left = token
            token = tokens.shift()
            token.right = sign()
        }
        return token
    }

    let factor = () => {
        if (tokens[0].type == "number") {
            return tokens.shift()
        } else if (tokens[0].type == "name") {
            let token = tokens.shift()
            if (tokens[0].type == "(") {
                // Left parentheses signify functions.
                tokens[0].left = token
                token = tokens.shift()
                token.right = sum()
                if (tokens[0].type != ")") {
                    throw `unexpected token ${tokens[0].type}`
                }
                tokens.shift()
            }
            return token
        } else if (tokens[0].type == "(") {
            // Parentheses get dropped. They are restored later in the unparse
            // function (unless they were unnecessary in the first place).
            tokens.shift()
            let token = sum()
            if (tokens[0].type != ")") {
                throw `unexpected token ${tokens[0].type}`
            }
            tokens.shift()
            return token
        } else {
            throw `unexpected token ${tokens[0].type}`
        }
    }

    let tokens = tokenize(expression)
    let root = sum()
    if (tokens[0].type != "end") {
        throw `unexpected token ${tokens[0].type}`
    }
    return root
}

// Reverses the parsing process. The result will be mathematically equivalent to
// the original expression (unless there is a bug), but it may not be the exact
// same string, e.g. parsing and unparsing "(a + b) + c" will result in
// "a + b + c".
let unparse = (token) => {
    let left
    let right
    if (token.left != undefined) {
        left = unparse(token.left)
    }
    if (token.right != undefined) {
        right = unparse(token.right)
    }
    switch (token.type) {
    case "(":
        return `${left}(${right})`
    case "*":
        if ("+-".includes(token.left.type)) {
            left = `(${left})`
        }
        if ("+-".includes(token.right.type)) {
            right = `(${right})`
        }
        return `${left} * ${right}`
    case "+":
        return `${left} + ${right}`
    case "-":
        if ("+-".includes(token.right.type)) {
            right = `(${right})`
        }
        return `${left} - ${right}`
    case "/":
        if ("+-".includes(token.left.type)) {
            left = `(${left})`
        }
        if ("*+-/".includes(token.right.type)) {
            right = `(${right})`
        }
        return `${left} / ${right}`
    case "number":
        return token.value.toString()
    case "name":
        return token.value
    case "^":
        if ("*+-/^~".includes(token.left.type)) {
            left = `(${left})`
        }
        if ("*+-/".includes(token.right.type)) {
            right = `(${right})`
        }
        return `${left}^${right}`
    case "~":
        if ("+-".includes(token.right.type)) {
            right = `(${right})`
        }
        return `-${right}`
    default:
        // Should never happen.
        throw `unexpected token ${token.type}`
    }
}

// From here on out we'll employ a little trick. We could build syntax trees in
// plain JavaScript like this:
// let root = new Token("+")
// root.left = new Token("number", 1)
// root.right = new Token("number", 2)
// But that would be very tedious. Instead, we'll let the parse function do it
// for us:
// let root = parse("1 + 2")
let deriveToken = (token) => {
    let deriv
    let left
    let dleft
    let right
    let dright
    // The parentheses are not always necessary but just in case. There will be
    // another parse-unparse cycle where they get removed if they are
    // unnecessary.
    if (token.left != undefined) {
        left = `(${unparse(token.left)})`
        dleft = `(${unparse(deriveToken(token.left))})`
    }
    if (token.right != undefined) {
        right = `(${unparse(token.right)})`
        dright = `(${unparse(deriveToken(token.right))})`
    }
    switch (token.type) {
    case "(":
        switch (token.left.value) {
        case "exp":
            deriv = `exp(${right}) * ${dright}`
            break
        case "ln":
            deriv = `${dright} / ${right}`
            break
        case "log10":
            deriv = `${dright} / (${right} * ln(10))`
            break
        case "log2":
            deriv = `${dright} / (${right} * ln(2))`
            break
        case "sqrt":
            deriv = `${dright} / (2 * sqrt(${right}))`
            break
        case "sin":
            deriv = `cos(${right}) * ${dright}`
            break
        case "cos":
            deriv = `-sin(${right}) * ${dright}`
            break
        case "tan":
            deriv = `sec(${right})^2 * ${dright}`
            break
        case "cot":
            deriv = `-csc(${right})^2 * ${dright}`
            break
        case "sec":
            deriv = `sec(${right}) * tan(${right}) * ${dright}`
            break
        case "csc":
            deriv = `-csc(${right}) * cot(${right}) * ${dright}`
            break
        case "asin":
            deriv = `sec(asin(${right})) * ${dright}`
            break
        case "acos":
            deriv = `-csc(acos(${right})) * ${dright}`
            break
        case "atan":
            deriv = `cos(atan(${right}))^2 * ${dright}`
            break
        case "acot":
            deriv = `-sin(acot(${right}))^2 * ${dright}`
            break
        case "asec":
            deriv = `cos(asec(${right})) * cot(asec(${right})) * ${dright}`
            break
        case "acsc":
            deriv = `-sin(acsc(${right})) * tan(acsc(${right})) * ${dright}`
            break
        case "sinh":
            deriv = `cosh(${right}) * ${dright}`
            break
        case "cosh":
            deriv = `sinh(${right}) * ${dright}`
            break
        case "tanh":
            deriv = `sech(${right})^2 * ${dright}`
            break
        case "coth":
            deriv = `-csch(${right})^2 * ${dright}`
            break
        case "sech":
            deriv = `-sech(${right}) * tanh(${right}) * ${dright}`
            break
        case "csch":
            deriv = `-csch(${right}) * coth(${right}) * ${dright}`
            break
        case "asinh":
            deriv = `sech(asinh(${right})) * ${dright}`
            break
        case "acosh":
            deriv = `csch(acosh(${right})) * ${dright}`
            break
        case "atanh":
            deriv = `cosh(atanh(${right}))^2 * ${dright}`
            break
        case "acoth":
            deriv = `-sinh(acoth(${right}))^2 * ${dright}`
            break
        case "asech":
            deriv = `-cosh(asech(${right})) * coth(asech(${right})) * ${dright}`
            break
        case "acsch":
            deriv = `-sinh(acsch(${right})) * tanh(acsch(${right})) * ${dright}`
            break
        default:
            // Unknown functions. Chain rule still applies.
            deriv = `${token.left.value}'(${right}) * ${dright}`
        }
        break
    case "*":
        deriv = `${dleft} * ${right} + ${left} * ${dright}`
        break
    case "+":
        deriv = `${dleft} + ${dright}`
        break
    case "-":
        deriv = `${dleft} - ${dright}`
        break
    case "/":
        deriv = `(${dleft} * ${right} - ${left} * ${dright}) / ${right}^2`
        break
    case "number":
        deriv = "0"
        break
    case "name":
        deriv = token.value == "x" ? "1" : "0"
        break
    case "^":
        if (token.left.isConstant()) {
            deriv = `${left}^${right} * ln(${left}) * ${dright}`
        } else if (token.right.isConstant()) {
            deriv = `${right} * ${left}^(${right} - 1) * ${dleft}`
        } else {
            // We could use this formula for all powers but we get simpler
            // results if we use special formulas for powers containing
            // constants.
            deriv = `${left}^${right}`
            deriv += ` * (${dleft} * ${right} / ${left}`
            deriv += ` + ${dright} * ln(${left}))`
        }
        break
    case "~":
        deriv = `-${dright}`
        break
    default:
        // Should never happen.
        throw `unexpected token ${token.type}`
    }
    return parse(deriv)
}

// Simplification mechanism

let addToObject = (object, token, number) => {
    let expression = `(${unparse(token)})`
    if (object[expression] == undefined) {
        object[expression] = 0
    }
    object[expression] += number
}

// A sum may be a complicated tree of +, -, and ~, so out strategy will be:
// - Make an inventory of individual terms,
// - Assemble the pieces.
// We'll employ a similar strategy for products.
let simplifySum = (token) => {
    let numberTerm = 0
    let terms = {}

    let collectTerms = (token, factor = 1) => {
        switch (token.type) {
        case "+":
            collectTerms(token.left, factor)
            collectTerms(token.right, factor)
            break
        case "-":
            collectTerms(token.left, factor)
            collectTerms(token.right, -factor)
            break
        case "*":
            if (token.left.type == "number") {
                collectTerms(token.right, factor * token.left.value)
            } else {
                addToObject(terms, token, factor)
            }
            break
        case "/":
            addToObject(terms, token, factor)
            break
        case "~":
            collectTerms(new Token("number", 0), factor)
            collectTerms(token.right, -factor)
            break
        case "^":
            addToObject(terms, token, factor)
            break
        case "(":
            addToObject(terms, token, factor)
            break
        case "name":
            addToObject(terms, token, factor)
            break
        case "number":
            numberTerm += factor * token.value
            break
        }
    }

    collectTerms(token)
    let expression = ""

    for (let term in terms) {
        let factor = terms[term]
        if (factor > 0) {
            if (expression != "") {
                expression += " + "
            }
            if (factor != 1) {
                expression += `${factor} * `
            }
            expression += term
        } else if (factor < 0) {
            if (expression != "") {
                expression += " - "
            } else {
                expression += "-"
            }
            if (factor != -1) {
                expression += `${-factor} * `
            }
            expression += term
        }
    }

    if (expression == "") {
        expression = `${numberTerm}`
    } else if (numberTerm > 0) {
        expression = `${expression} + ${numberTerm}`
    } else if (numberTerm < 0) {
        expression = `${expression} - ${-numberTerm}`
    }

    return parse(expression)
}

// Euclid's algorithm to find the GCD of two numbers.
let euclid = (a, b) => {
    if (b == 0) {
        return a
    } else {
        return euclid(b, a % b)
    }
}

let simplifyProduct = (token) => {
    let numberFactor1 = 1 // numerator
    let numberFactor2 = 1 // denominator
    let factors = {}

    let collectFactors = (token, exponent = 1) => {
        switch (token.type) {
        case "+":
        case "-":
            addToObject(factors, token, exponent)
            break
        case "*":
            collectFactors(token.left, exponent)
            collectFactors(token.right, exponent)
            break
        case "/":
            collectFactors(token.left, exponent)
            collectFactors(token.right, -exponent)
            break
        case "~":
            collectFactors(new Token("number", -1), exponent)
            collectFactors(token.right, exponent)
            break
        case "^":
            if (token.right.type == "number") {
                collectFactors(token.left, exponent * token.right.value)
            } else {
                addToObject(factors, token, exponent)
            }
            break
        case "(":
        case "name":
            addToObject(factors, token, exponent)
            break
        case "number":
            if (exponent >= 0) {
                numberFactor1 *= Math.pow(token.value, exponent)
            } else {
                numberFactor2 *= Math.pow(token.value, -exponent)
            }
            break
        }
    }

    collectFactors(token)
    if (numberFactor2 == 0) {
        return parse("0 / 0")
    } else if (numberFactor1 == 0) {
        return new Token("number", 0)
    }
    let gcd = euclid(numberFactor1, numberFactor2)
    numberFactor1 /= gcd
    numberFactor2 /= gcd
    // From here on out numberFactor2 will be non-negative.
    if (numberFactor2 < 0) {
        numberFactor1 = -numberFactor1
        numberFactor2 = -numberFactor2
    }
    let expression1 = "" // numerator
    let expression2 = "" // denominator

    for (let factor in factors) {
        let exponent = factors[factor]
        if (exponent > 0) {
            if (expression1 != "") {
                expression1 += " * "
            }
            expression1 += `${factor}`
            if (exponent != 1) {
                expression1 += `^${exponent}`
            }
        } else if (exponent < 0) {
            if (expression2 != "") {
                expression2 += " * "
            }
            expression2 += `${factor}`
            if (exponent != -1) {
                expression2 += `^${-exponent}`
            }
        }
    }

    if (expression1 == "") {
        expression1 = `${numberFactor1}`
    } else if (numberFactor1 == 1) {
        expression1 = `${expression1}`
    } else if (numberFactor1 == -1) {
        expression1 = `-${expression1}`
    } else {
        expression1 = `${numberFactor1} * ${expression1}`
    }

    if (expression2 == "") {
        expression2 = `${numberFactor2}`
    } else if (numberFactor2 == 1) {
        expression2 = `${expression2}`
    } else {
        expression2 = `${numberFactor2} * ${expression2}`
    }

    if (expression2 == "1") {
        return parse(expression1)
    } else {
        return parse(`${expression1} / (${expression2})`)
    }
}

let simplifyPower = (token) => {
    if (token.left.type == "number" && token.right.type == "number") {
        if (token.right.value >= 0) {
            let value = Math.pow(token.left.value, token.right.value)
            return new Token("number", value)
        } else {
            let value = Math.pow(token.left.value, -token.right.value)
            return parse(`1 / ${value}`)
        }
    } else if (token.left.type == "number") {
        if (token.left.value == 0 || token.left.value == 1) {
            return token.left
        }
    } else if (token.right.type == "number") {
        if (token.right.value == 0) {
            return new Token("number", 1)
        } else if (token.right.value == 1) {
            return token.left
        }
    }
    return token
}

let functionSimplifications = {
    "exp(0)": "1",
    "exp(1)": "e",
    "ln(1)": "0",
    "ln(e)": "1",
    "log10(1)": "0",
    "log10(10)": "1",
    "log2(1)": "0",
    "log2(2)": "1",
    "sqrt(0)": "0",
    "sqrt(1)": "1"
}

let simplifyFunction = (token) => {
    let simplification = functionSimplifications[unparse(token)]
    if (simplification != undefined) {
        return parse(simplification)
    } else {
        return token
    }
}

// Don't expect this function to always find the simplest form. Only a few
// common sense simplifications are applied.
let simplify = (token) => {
    // Simplify subtrees first.
    if (token.left != undefined) {
        token.left = simplify(token.left)
    }
    if (token.right != undefined) {
        token.right = simplify(token.right)
    }
    switch (token.type) {
    case "+":
    case "-":
    case "~":
        return simplifySum(token)
    case "*":
    case "/":
        return simplifyProduct(token)
    case "^":
        return simplifyPower(token)
    case "(":
        return simplifyFunction(token)
    default:
        // Return the token unchanged if we find no simplification.
        return token
    }
}

let derive = (expression) => {
    let root = parse(expression)
    root = deriveToken(root)
    root = simplify(root)
    return unparse(root)
}

// With all this work done, writing code to evaluate an expression for a given x
// becomes easy, so why not?
let evaluateToken = (token, x) => {
    let left
    let right
    if (token.left != undefined) {
        left = evaluateToken(token.left, x)
    }
    if (token.right != undefined) {
        right = evaluateToken(token.right, x)
    }
    switch (token.type) {
    case "(":
        switch (token.left.value) {
        case "exp":
            return Math.exp(right)
        case "ln":
            return Math.log(right)
        case "log10":
            return Math.log10(right)
        case "log2":
            return Math.log2(right)
        case "sqrt":
            return Math.sqrt(right)
        case "sin":
            return Math.sin(right)
        case "cos":
            return Math.cos(right)
        case "tan":
            return Math.tan(right)
        case "cot":
            return 1 / Math.tan(right)
        case "sec":
            return 1 / Math.cos(right)
        case "csc":
            return 1 / Math.sin(right)
        case "asin":
            return Math.asin(right)
        case "acos":
            return Math.acos(right)
        case "atan":
            return Math.atan(right)
        case "acot":
            return (Math.atan(1 / right) + Math.PI) % Math.PI
        case "asec":
            return Math.acos(1 / right)
        case "acsc":
            return Math.asin(1 / right)
        case "sinh":
            return Math.sinh(right)
        case "cosh":
            return Math.cosh(right)
        case "tanh":
            return Math.tanh(right)
        case "coth":
            return 1 / Math.tanh(right)
        case "sech":
            return 1 / Math.cosh(right)
        case "csch":
            return 1 / Math.sinh(right)
        case "asinh":
            return Math.asinh(right)
        case "acosh":
            return Math.acosh(right)
        case "atanh":
            return Math.atanh(right)
        case "acoth":
            return Math.atanh(1 / right)
        case "asech":
            return Math.acosh(1 / right)
        case "acsch":
            return Math.asinh(1 / right)
        default:
            return NaN
        }
    case "*":
        return left * right
    case "+":
        return left + right
    case "-":
        return left - right
    case "/":
        return left / right
    case "number":
        return token.value
    case "name":
        switch (token.value) {
        case "e":
            return Math.E
        case "pi":
            return Math.PI
        case "x":
            return x
        default:
            return NaN
        }
    case "^":
        return Math.pow(left, right)
    case "~":
        return -right
    default:
        throw `unexpected token ${token.type}`
    }
}

let evaluate = (expression, x) => {
    let root = parse(expression)
    return evaluateToken(root, x)
}