var assert = function(condition, message)
{
    if (!condition)
    {
        throw message
    }
}

var testTokenizer = function()
{
    var expression = "1 2.0 3.0e5 4e5+-*/()sin"
    var tokenizer = new Tokenizer(expression)
    var token = tokenizer.nextToken()
    assert(token.type === "number" && token.value === 1, "tokenizer test failed")
    token = tokenizer.nextToken()
    assert(token.type === "number" && token.value === 2, "tokenizer test failed")
    token = tokenizer.nextToken()
    assert(token.type === "number" && token.value === 300000, "tokenizer test failed")
    token = tokenizer.nextToken()
    assert(token.type === "number" && token.value === 400000, "tokenizer test failed")
    token = tokenizer.nextToken()
    assert(token.type === "+", "tokenizer test failed")
    token = tokenizer.nextToken()
    assert(token.type === "-", "tokenizer test failed")
    token = tokenizer.nextToken()
    assert(token.type === "*", "tokenizer test failed")
    token = tokenizer.nextToken()
    assert(token.type === "/", "tokenizer test failed")
    token = tokenizer.nextToken()
    assert(token.type === "(", "tokenizer test failed")
    token = tokenizer.nextToken()
    assert(token.type === ")", "tokenizer test failed")
    token = tokenizer.nextToken()
    assert(token.type === "identifier" && token.value === "sin", "tokenizer test failed")
    token = tokenizer.nextToken()
    assert(token.type === "end", "tokenizer test failed")
}

testTokenizer()

var testParser = function()
{
    var token = parse("1 + 2 * 3")
    assert(token.type === "+", "parser test failed")
    assert(token.right.type === "*", "parser test failed")
    token = parse("(1 + 2) * 3")
    assert(token.type === "*", "parser test failed")
    assert(token.left.type === "+", "parser test failed")
}

testParser()

var testUnparse = function()
{
    var token = parse("(1 + 2) * 3")
    var expression = unparse(token)
    assert(expression === "(1 + 2) * 3", "unparse test failed")
}

testUnparse()

var testSimplifyMultiplication = function()
{
    var token = parse("1 * a")
    simplify(token)
    assert(token.type === "identifier" && token.value === "a", "testSimplifyMultiplication failed")
    token = parse("0 * a")
    simplify(token)
    assert(token.type === "number" && token.value === 0, "testSimplifyMultiplication failed")
    token = parse("a * 1")
    simplify(token)
    assert(token.type === "identifier" && token.value === "a", "testSimplifyMultiplication failed")
    token = parse("a * 0")
    simplify(token)
    assert(token.type === "number" && token.value === 0, "testSimplifyMultiplication failed")
}

testSimplifyMultiplication()

var testSimplifyAddition = function()
{
    var token = parse("0 + a")
    simplify(token)
    assert(token.type === "identifier" && token.value === "a", "testSimplifyAddition failed")
    token = parse("a + 0")
    simplify(token)
    assert(token.type === "identifier" && token.value === "a", "testSimplifyAddition failed")
}

testSimplifyAddition()

var testSimplifySubtraction = function()
{
    var token = parse("0 - a")
    simplify(token)
    assert(token.type === "~" && token.right.value === "a", "testSimplifySubtraction failed")
    token = parse("a - 0")
    simplify(token)
    assert(token.type === "identifier" && token.value === "a", "testSimplifySubtraction failed")
}

testSimplifySubtraction()

var testSimplifyDivision = function()
{
    var token = parse("0 / a")
    simplify(token)
    assert(token.type === "number" && token.value === 0, "testSimplifyDivision failed")
    token = parse("a / 1")
    simplify(token)
    assert(token.type === "identifier" && token.value === "a", "testSimplifyDivision failed")
}

testSimplifyDivision()

var testSimplifyNegation = function()
{
    var token = parse("-0")
    simplify(token)
    assert(token.type === "number" && token.value === 0, "testSimplifyNegation failed")
}

testSimplifyNegation()

var testDeriveX = function()
{
    var token = parse("x")
    token = derive(token)
    assert(token.type === "number" && token.value === 1, "testDeriveX failed")
}

testDeriveX()
