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
