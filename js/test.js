var assert = function(condition, message)
{
    if (!condition)
    {
        throw message
    }
}

var tests =
{
    testTokenizeNumbers: function()
    {
        var expression = "1 2.0 3.0e5 4e5"
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === "number" && token.value === 1, "tokenization failed: 1")
        token = tokenizer.nextToken()
        assert(token.type === "number" && token.value === 2, "tokenization failed: 2")
        token = tokenizer.nextToken()
        assert(token.type === "number" && token.value === 300000, "tokenization failed: 300000")
        token = tokenizer.nextToken()
        assert(token.type === "number" && token.value === 400000, "tokenization failed: 400000")
    },
    
    testTokenizeOperators: function()
    {
        var expression = "+-*/()"
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === "+", "tokenization failed: +")
        token = tokenizer.nextToken()
        assert(token.type === "-", "tokenization failed: -")
        token = tokenizer.nextToken()
        assert(token.type === "*", "tokenization failed: *")
        token = tokenizer.nextToken()
        assert(token.type === "/", "tokenization failed: /")
        token = tokenizer.nextToken()
        assert(token.type === "(", "tokenization failed: (")
        token = tokenizer.nextToken()
        assert(token.type === ")", "tokenization failed: )")
    },
    
    testTokenizeIdentifiers: function()
    {
        var expression = "sin"
        var tokenizer = new Tokenizer(expression)
        var token = tokenizer.nextToken()
        assert(token.type === "identifier" && token.value === "sin", "tokenization failed: sin")
    },
    
    testParser: function()
    {
        var token = parse("1 + 2 * 3")
        assert(token.type === "+" && token.right.type === "*", "parsing failed: 1 + 2 * 3")
        token = parse("(1 + 2) * 3")
        assert(token.type === "*" && token.left.type === "+", "parsing failed: (1 + 2) * 3")
    },
    
    testUnparse: function()
    {
        var token = parse("(1 + 2) * 3")
        var expression = unparse(token)
        assert(expression === "(1 + 2) * 3", "unparse test failed")
    },
    
    testSimplifyMultiplication: function()
    {
        var token = parse("1 * a")
        simplify(token)
        assert(token.type === "identifier" && token.value === "a", "simplification of 1 * a failed")
        token = parse("0 * a")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of 0 * a failed")
        token = parse("a * 1")
        simplify(token)
        assert(token.type === "identifier" && token.value === "a", "simplification of a * 1 failed")
        token = parse("a * 0")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of a * 0 failed")
    },
    
    testSimplifyAddition: function()
    {
        var token = parse("0 + a")
        simplify(token)
        assert(token.type === "identifier" && token.value === "a", "simplification of 0 + a failed")
        token = parse("a + 0")
        simplify(token)
        assert(token.type === "identifier" && token.value === "a", "simplification of a + 0 failed")
    },
    
    testSimplifySubtraction: function()
    {
        var token = parse("0 - a")
        simplify(token)
        assert(token.type === "~" && token.right.value === "a", "simplification of 0 - a failed")
        token = parse("a - 0")
        simplify(token)
        assert(token.type === "identifier" && token.value === "a", "simplification of a - 0 failed")
    },
    
    testSimplifyDivision: function()
    {
        var token = parse("0 / a")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of 0 / a failed")
        token = parse("a / 1")
        simplify(token)
        assert(token.type === "identifier" && token.value === "a", "simplification of a / 1 failed")
    },
    
    testSimplifyNegation: function()
    {
        var token = parse("-0")
        simplify(token)
        assert(token.type === "number" && token.value === 0, "simplification of -0 failed")
    },
    
    testDeriveX: function()
    {
        var token = parse("x")
        token = derive(token)
        assert(token.type === "number" && token.value === 1, "derivation of x failed")
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
