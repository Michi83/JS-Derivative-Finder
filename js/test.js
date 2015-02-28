var assert = function(condition, message)
{
    if (!condition)
    {
        throw message
    }
}

var tests =
{
    testTokenizeIntegers: function()
    {
        var expression = "123"
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === "number" && token.value === 123, "tokenization failed: 123")
    },
    
    testTokenizeFloats: function()
    {
        var expression = "123.456"
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === "number" && token.value === 123.456, "tokenization failed: 123.456")
    },
    
    testTokenizeFloatsENotation: function()
    {
        var expression = "1.234e-56"
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === "number" && token.value === 1.234e-56, "tokenization failed: 1.234e-56")
    },
    
    testTokenizePlus: function()
    {
        var expression = "+"
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === "+", "tokenization failed: +")
    },
    
    testTokenizeMinus: function()
    {
        var expression = "-"
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === "-", "tokenization failed: -")
    },
    
    testTokenizeTimes: function()
    {
        var expression = "*"
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === "*", "tokenization failed: *")
    },
    
    testTokenizeSlash: function()
    {
        var expression = "/"
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === "/", "tokenization failed: /")
    },
    
    testTokenizePower: function()
    {
        var expression = "^"
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === "^", "tokenization failed: ^")
    },
    
    testTokenizeLeftParen: function()
    {
        var expression = "("
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === "(", "tokenization failed: (")
    },
    
    testTokenizeRightParen: function()
    {
        var expression = ")"
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === ")", "tokenization failed: )")
    },
    
    testTokenizeIdentifiers: function()
    {
        var expression = "Abc_123"
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === "identifier" && token.value === "Abc_123", "tokenization failed: Abc_123")
    },
    
    testTokenizeWhitespace: function()
    {
        var expression = "\t\n\r a"
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === "identifier", "tokenization failed: \t\n\r a")
    },
    
    testTokenizeEnd: function()
    {
        var expression = ""
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === "end", "tokenization failed: end")
    },
    
    testParseAddition: function()
    {
        var expression = "a + b + c"
        var token = parse(expression)
        assert(token.type === "+" && token.left.type === "+" && token.right.type === "identifier", "parsing failed: a + b + c")
    },
    
    testParseSubtraction: function()
    {
        var expression = "a - b - c"
        var token = parse(expression)
        assert(token.type === "-" && token.left.type === "-" && token.right.type === "identifier", "parsing failed: a - b - c")
    },
    
    testParseMultiplication: function()
    {
        var expression = "a * b * c"
        var token = parse(expression)
        assert(token.type === "*" && token.left.type === "*" && token.right.type === "identifier", "parsing failed: a * b * c")
    },
    
    testParseDivision: function()
    {
        var expression = "a / b / c"
        var token = parse(expression)
        assert(token.type === "/" && token.left.type === "/" && token.right.type === "identifier", "parsing failed: a / b / c")
    },
    
    testParseNegation: function()
    {
        var expression = "--a"
        var token = parse(expression)
        assert(token.type === "~" && token.right.type === "~" && token.right.right.type === "identifier", "parsing failed: --a")
    },
    
    testParsePower: function()
    {
        var expression = "a^b^c"
        var token = parse(expression)
        assert(token.type === "^" && token.left.type === "identifier" && token.right.type === "^", "parsing failed: a^b^c")
    },
    
    testParsePowerWithParens: function()
    {
        var expression = "(a^b)^c"
        var token = parse(expression)
        assert(token.type === "^" && token.left.type === "^" && token.right.type === "identifier", "parsing failed: (a^b)^c")
    },
    
    testParseFunction: function()
    {
        var expression = "sin(cos(1))"
        var token = parse(expression)
        assert(token.type === "(" && token.left.type === "identifier" && token.right.type === "(", "parsing failed: sin(cos(1))")
    },
    
    testParsePrecedence: function()
    {
        var expression = "a + b * c"
        var token = parse(expression)
        assert(token.type === "+" && token.left.type === "identifier" && token.right.type === "*", "parsing failed: a + b * c")
    },
    
    testParsePrecedenceWithParens: function()
    {
        var expression = "(a + b) * c"
        var token = parse(expression)
        assert(token.type === "*" && token.left.type === "+" && token.right.type === "identifier", "parsing failed: (a + b) * c")
    },
    
    testParsePowerNegation: function()
    {
        var expression = "-a^b"
        var token = parse(expression)
        assert(token.type === "~" && token.right.type === "^", "parsing failed: -a^b")
    },
    
    testParsePowerNegationWithParens: function()
    {
        var expression = "(-a)^b"
        var token = parse(expression)
        assert(token.type === "^" && token.left.type === "~", "parsing failed: (-a)^b")
    },
    
    testUnparseBasicArithmetic: function()
    {
        var token = parse("-a + b - c * d / e^f(g)")
        expression = unparse(token)
        assert(expression === "-a + b - c * d / e^f(g)", "unparsing failed: -a + b - c * d / e^f(g)")
    },
    
    testUnparseFractionsOfProducts: function()
    {
        var token = parse("a * b / (c * d)")
        expression = unparse(token)
        assert(expression === "a * b / (c * d)", "unparsing failed: a * b / (c * d)")
    },
    
    testUnparseDifferencesOfSums: function()
    {
        var token = parse("a + b - (c + d)")
        expression = unparse(token)
        assert(expression === "a + b - (c + d)", "unparsing failed: a + b - (c + d)")
    },
    
    testUnparseParens: function()
    {
        var token = parse("(a + b) * (c + d)")
        var expression = unparse(token)
        assert(expression === "(a + b) * (c + d)", "unparsing failed: (a + b) * (c + d)")
    },
    
    testUnparsePower: function()
    {
        var token = parse("a^b^c")
        var expression = unparse(token)
        assert(expression === "a^b^c", "unparsing failed: a^b^c")
    },
    
    testUnparsePowerWithParens: function()
    {
        var token = parse("(a^b)^c")
        var expression = unparse(token)
        assert(expression === "(a^b)^c", "unparsing failed: (a^b)^c")
    },
    
    testUnparsePowerNegation: function()
    {
        var token = parse("-a^b")
        var expression = unparse(token)
        assert(expression === "-a^b", "unparsing failed: -a^b")
    },
    
    testUnparsePowerNegationWithParens: function()
    {
        var token = parse("(-a)^b")
        var expression = unparse(token)
        assert(expression === "(-a)^b", "unparsing failed: (-a)^b")
    },
    
    testSimplifyNumberPlusNumber: function()
    {
        var token = parse("10 + 5")
        simplify(token)
        assert(token.type === "number" && token.value === 15, "simplification of 10 + 5 failed")
    },
    
    testSimplifyNumberMinusNumber: function()
    {
        var token = parse("10 - 5")
        simplify(token)
        assert(token.type === "number" && token.value === 5, "simplification of 10 - 5 failed")
    },
    
    testSimplifyNumberTimesNumber: function()
    {
        var token = parse("10 * 5")
        simplify(token)
        assert(token.type === "number" && token.value === 50, "simplification of 10 * 5 failed")
    },
    
    testSimplifyNumberSlashNumber: function()
    {
        var token = parse("10 / 5")
        simplify(token)
        assert(token.type === "number" && token.value === 2, "simplification of 10 / 5 failed")
    },
    
    testSimplifyReduceFraction: function()
    {
        var token = parse("2 / 4")
        simplify(token)
        assert(token.left.value === 1 && token.right.value === 2, "simplification of 2 / 4 failed")
    },
    
    testSimplifyReduceFractionWithNegativeNumerator: function()
    {
        var token = parse("-2 / 4")
        simplify(token)
        assert(token.left.value === -1 && token.right.value === 2, "simplification of -2 / 4 failed")
    },
    
    testSimplifyReduceFractionWithNegativeDenominator: function()
    {
        var token = parse("2 / -4")
        simplify(token)
        assert(token.left.value === -1 && token.right.value === 2, "simplification of 2 / -4 failed")
    },
    
    testSimplifyReduceFractionWithNegativeNumeratorAndDenominator: function()
    {
        var token = parse("-2 / -4")
        simplify(token)
        assert(token.left.value === 1 && token.right.value === 2, "simplification of -2 / -4 failed")
    },
    
    testSimplifyMinusNumber: function()
    {
        var token = parse("-10")
        simplify(token)
        assert(token.type === "number" && token.value === -10, "simplification of -10 failed")
    },
    
    testSimplifyMinusZero: function()
    {
        var token = parse("-0")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of -0 failed")
    },
    
    testSimplifyNumberToTheNumberthPower: function()
    {
        var token = parse("10^5")
        simplify(token)
        assert(token.type === "number" && token.value === 100000, "simplification of 10^5 failed")
    },
    
    testSimplifyZeroPlusA: function()
    {
        var token = parse("0 + a")
        simplify(token)
        assert(token.type === "identifier" && token.value === "a", "simplification of 0 + a failed")
    },
    
    testSimplifyAPlusZero: function()
    {
        var token = parse("a + 0")
        simplify(token)
        assert(token.type === "identifier" && token.value === "a", "simplification of a + 0 failed")
    },
    
    testSimplifyZeroMinusA: function()
    {
        var token = parse("0 - a")
        simplify(token)
        assert(token.type === "~" && token.right.type === "identifier", "simplification of 0 - a failed")
    },
    
    testSimplifyAMinusZero: function()
    {
        var token = parse("a - 0")
        simplify(token)
        assert(token.type === "identifier" && token.value === "a", "simplification of a - 0 failed")
    },
    
    testSimplifyZeroTimesA: function()
    {
        var token = parse("0 * a")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of 0 * a failed")
    },
    
    testSimplifyZeroTimesA: function()
    {
        var token = parse("a * 0")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of a * 0 failed")
    },
    
    testSimplifyOneTimesA: function()
    {
        var token = parse("1 * a")
        simplify(token)
        assert(token.type === "identifier" && token.value === "a", "simplification of 1 * a failed")
    },
    
    testSimplifyATimesOne: function()
    {
        var token = parse("a * 1")
        simplify(token)
        assert(token.type === "identifier" && token.value === "a", "simplification of a * 1 failed")
    },
    
    testSimplifyZeroSlashA: function()
    {
        var token = parse("0 / a")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of 0 / a failed")
    },
    
    testSimplifyASlashOne: function()
    {
        var token = parse("a / 1")
        simplify(token)
        assert(token.type === "identifier" && token.value === "a", "simplification of a / 1 failed")
    },
    
    testSimplifyZeroToTheAthPower: function()
    {
        var token = parse("0^a")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of 0^a failed")
    },
    
    testSimplifyAToTheZerothPower: function()
    {
        var token = parse("a^0")
        simplify(token)
        assert(token.type === "number" && token.value === 1, "simplification of a^0 failed")
    },
    
    testSimplifyOneToTheAthPower: function()
    {
        var token = parse("1^a")
        simplify(token)
        assert(token.type === "number" && token.value === 1, "simplification of 1^a failed")
    },
    
    testSimplifyAToTheFirstPower: function()
    {
        var token = parse("a^1")
        simplify(token)
        assert(token.type === "identifier" && token.value === "a", "simplification of a^1 failed")
    },
    
    testSimplifySinZero: function()
    {
        var token = parse("sin(0)")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of sin(0) failed")
    },
    
    testSimplifySinHalfPi: function()
    {
        var token = parse("sin(pi / 2)")
        simplify(token)
        assert(token.type === "number" && token.value === 1, "simplification of sin(pi / 2) failed")
    },
    
    testSimplifySinPi: function()
    {
        var token = parse("sin(pi)")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of sin(pi) failed")
    },
    
    testSimplifySinThreeTimesHalfPi: function()
    {
        var token = parse("sin(3 * pi / 2)")
        simplify(token)
        assert(token.type === "number" && token.value === -1, "simplification of sin(3 * pi / 2) failed")
    },
    
    testSimplifyCosZero: function()
    {
        var token = parse("cos(0)")
        simplify(token)
        assert(token.type === "number" && token.value === 1, "simplification of cos(0) failed")
    },
    
    testSimplifyCosHalfPi: function()
    {
        var token = parse("cos(pi / 2)")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of cos(pi / 2) failed")
    },
    
    testSimplifyCosPi: function()
    {
        var token = parse("cos(pi)")
        simplify(token)
        assert(token.type === "number" && token.value === -1, "simplification of cos(pi) failed")
    },
    
    testSimplifyCosThreeTimesHalfPi: function()
    {
        var token = parse("cos(3 * pi / 2)")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of cos(3 * pi / 2) failed")
    },
    
    testSimplifyTanZero: function()
    {
        var token = parse("tan(0)")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of tan(0) failed")
    },
    
    testSimplifyTanPi: function()
    {
        var token = parse("tan(pi)")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of tan(pi) failed")
    },
    
    testSimplifyLnOne: function()
    {
        var token = parse("ln(1)")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of ln(1) failed")
    },
    
    testSimplifyLnE: function()
    {
        var token = parse("ln(e)")
        simplify(token)
        assert(token.type === "number" && token.value === 1, "simplification of ln(e) failed")
    },
    
    testDeriveNumber: function()
    {
        var derivative = deriveExpression("10")
        assert(derivative === "0", "derivation failed: 10")
    },
    
    testDeriveConstant: function()
    {
        var derivative = deriveExpression("a")
        assert(derivative === "0", "derivation failed: a")
    },
    
    testDeriveX: function()
    {
        var derivative = deriveExpression("x")
        assert(derivative === "1", "derivation failed: x")
    },
    
    testDeriveAddition: function()
    {
        var derivative = deriveExpression("x^3 + x^2")
        assert(derivative === "3 * x^2 + 2 * x", "derivation failed: x^3 + x^2")
    },
    
    testDeriveSubtraction: function()
    {
        var derivative = deriveExpression("x^3 - x^2")
        assert(derivative === "3 * x^2 - 2 * x", "derivation failed: x^3 - x^2")
    },
    
    testDeriveMultiplication: function()
    {
        var derivative = deriveExpression("x^3 * x^2")
        assert(derivative === "3 * x^2 * x^2 + x^3 * 2 * x", "derivation failed: x^3 * x^2")
    },
    
    testDeriveDivision: function()
    {
        var derivative = deriveExpression("x^3 / x^2")
        assert(derivative === "(3 * x^2 * x^2 - x^3 * 2 * x) / (x^2)^2", "derivation failed: x^3 / x^2")
    },
    
    testDeriveNegation: function()
    {
        var derivative = deriveExpression("-x^3")
        assert(derivative === "-(3 * x^2)", "derivation failed: -x^3")
    },
    
    testDeriveXToTheNthPower: function()
    {
        var derivative = deriveExpression("x^3")
        assert(derivative === "3 * x^2", "derivation failed: x^3")
    },
    
    testDeriveXToTheNthPowerWithChainRule: function()
    {
        var derivative = deriveExpression("sin(x)^3")
        assert(derivative === "3 * sin(x)^2 * cos(x)", "derivation failed: sin(x)^3")
    },
    
    testDeriveXToConstantPower: function()
    {
        var derivative = deriveExpression("x^sin(1)")
        assert(derivative === "sin(1) * x^(sin(1) - 1)", "derivation failed: x^sin(1)")
    },
    
    testDeriveXToConstantPowerWithChainRule: function()
    {
        var derivative = deriveExpression("sin(x)^sin(1)")
        assert(derivative === "sin(1) * sin(x)^(sin(1) - 1) * cos(x)", "derivation failed: sin(x)^sin(1)")
    },
    
    testDeriveEToTheXthPower: function()
    {
        var derivative = deriveExpression("e^x")
        assert(derivative === "e^x", "derivation failed: e^x")
    },
    
    testDeriveEToTheXthPowerWithChainRule: function()
    {
        var derivative = deriveExpression("e^sin(x)")
        assert(derivative === "e^sin(x) * cos(x)", "derivation failed: e^sin(x)")
    },
    
    testDeriveConstantToTheXthPower: function()
    {
        var derivative = deriveExpression("sin(1)^x")
        assert(derivative === "sin(1)^x * ln(sin(1))", "derivation failed: sin(1)^x")
    },
    
    testDeriveConstantToTheXthPowerWithChainRule: function()
    {
        var derivative = deriveExpression("sin(1)^sin(x)")
        assert(derivative === "sin(1)^sin(x) * ln(sin(1)) * cos(x)", "derivation failed: sin(1)^sin(x)")
    },
    
    testDeriveSine: function()
    {
        var derivative = deriveExpression("sin(x)")
        assert(derivative === "cos(x)", "derivation failed: sin(x)")
    },
    
    testDeriveSineWithChainRule: function()
    {
        var derivative = deriveExpression("sin(cos(x))")
        assert(derivative === "cos(cos(x)) * -sin(x)", "derivation failed: sin(cos(x))")
    },
    
    testDeriveCosine: function()
    {
        var derivative = deriveExpression("cos(x)")
        assert(derivative === "-sin(x)", "derivation failed: cos(x)")
    },
    
    testDeriveCosineWithChainRule: function()
    {
        var derivative = deriveExpression("cos(sin(x))")
        assert(derivative === "-sin(sin(x)) * cos(x)", "derivation failed: cos(sin(x))")
    },
    
    testDeriveTangent: function()
    {
        var derivative = deriveExpression("tan(x)")
        assert(derivative === "1 / cos(x)^2", "derivation failed: tan(x)")
    },
    
    testDeriveTangentWithChainRule: function()
    {
        var derivative = deriveExpression("tan(x^2)")
        assert(derivative === "2 * x / cos(x^2)^2", "derivation failed: tan(x^2)")
    },
    
    testDeriveLogarithm: function()
    {
        var derivative = deriveExpression("ln(x)")
        assert(derivative === "1 / x", "derivation failed: ln(x)")
    },
    
    testDeriveLogarithmWithChainRule: function()
    {
        var derivative = deriveExpression("ln(sin(x))")
        assert(derivative === "cos(x) / sin(x)", "derivation failed: ln(sin(x))")
    }
}

var runTests = function()
{
    for (key in tests)
    {
        var value = tests[key]
        try
        {
            value()
            document.body.innerHTML += "<div class=\"green\">" + key + " passed</div>"
        }
        catch (exception)
        {
            document.body.innerHTML += "<div class=\"red\">" + key + " failed (" + exception + ")</div>"
        }
    }
}
