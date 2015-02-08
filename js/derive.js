var derive = function(token)
{
    if (token.type === "*")
    {
        return new Token
        (
            "+",
            undefined,
            new Token("*", undefined, derive(token.left), token.right.deepCopy()),
            new Token("*", undefined, token.left.deepCopy(), derive(token.right))
        )
    }
    else if (token.type === "+")
    {
        var left = derive(token.left)
        var right = derive(token.right)
        return new Token("+", undefined, left, right)
    }
    else if (token.type === "-")
    {
        var left = derive(token.left)
        var right = derive(token.right)
        return new Token("+", undefined, left, right)
    }
    else if (token.type === "^")
    {
        if (token.right.type === "number")
        {
            return new Token
            (
                "*",
                undefined,
                new Token
                (
                    "*",
                    undefined,
                    new Token("number", token.right.value),
                    new Token("^", undefined, token.left.deepCopy(), new Token("number", token.right.value - 1))
                ),
                derive(token.left)
            )
        }
        else
        {
            throw "derivative not implemented"
        }
    }
    else if (token.type === "identifier")
    {
        if (token.value === "x")
        {
            return new Token("number", 1)
        }
        else
        {
            return new Token("number", 0)
        }
    }
    else if (token.type === "number")
    {
        return new Token("number", 0)
    }
}
