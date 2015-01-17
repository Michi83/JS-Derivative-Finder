var parse = function(expression)
{
    var advance = function(expected)
    {
        if (expected !== undefined && lookahead.type !== expected)
        {
            throw expected + " expected but " + lookahead.type + " found"
        }
        var token = lookahead
        lookahead = tokenizer.nextToken()
        return token
    }
    
    var sum = function()
    {
        var token = product()
        while (lookahead.type === "+" || lookahead.type === "-")
        {
            lookahead.left = token
            token = advance()
            token.right = product()
        }
        return token
    }
    
    var product = function()
    {
        var token = sign()
        while (lookahead.type === "*" || lookahead.type === "/")
        {
            lookahead.left = token
            token = advance()
            token.right = sign()
        }
        return token
    }
    
    var sign = function()
    {
        if (lookahead.type === "+")
        {
            advance()
            return sign()
        }
        else if (lookahead.type === "-")
        {
            var token = advance()
            token.type = "~"
            token.right = sign()
            return token
        }
        else
        {
            return factor()
        }
    }
    
    var factor = function()
    {
        if (lookahead.type === "(")
        {
            advance()
            var token = sum()
            advance(")")
            return token
        }
        else if (lookahead.type === "identifier" || lookahead.type === "number")
        {
            return advance()
        }
        else
        {
            throw "unexpected " + lookahead.type
        }
    }
    
    var tokenizer = new Tokenizer(expression)
    var lookahead
    advance()
    var token = sum()
    if (lookahead.type !== "end")
    {
        throw "end expected but " + lookahead.type + " found"
    }
    return token
}
