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
    assert(token.type === "number" && token.value === 1)
    token = tokenizer.nextToken()
    assert(token.type === "number" && token.value === 2)
    token = tokenizer.nextToken()
    assert(token.type === "number" && token.value === 300000)
    token = tokenizer.nextToken()
    assert(token.type === "number" && token.value === 400000)
    token = tokenizer.nextToken()
    assert(token.type === "+")
    token = tokenizer.nextToken()
    assert(token.type === "-")
    token = tokenizer.nextToken()
    assert(token.type === "*")
    token = tokenizer.nextToken()
    assert(token.type === "/")
    token = tokenizer.nextToken()
    assert(token.type === "(")
    token = tokenizer.nextToken()
    assert(token.type === ")")
    token = tokenizer.nextToken()
    assert(token.type === "identifier" && token.value === "sin")
    token = tokenizer.nextToken()
    assert(token.type === "end")
}

testTokenizer()
