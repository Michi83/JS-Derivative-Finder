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
    
    testDeriveX: function()
    {
        var token = parse("x")
        token = derive(token)
        simplify(token)
        assert(unparse(token) === "1", "derivation of x failed")
    },
    
    testDeriveXToTheNthPower: function()
    {
        var token = parse("x^3")
        token = derive(token)
        simplify(token)
        assert(unparse(token) === "3 * x^2", "derivation of x^3 failed")
    },
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
