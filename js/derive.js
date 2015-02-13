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
        return new Token("+", undefined, derive(token.left), derive(token.right))
    }
    else if (token.type === "-")
    {
        return new Token("-", undefined, derive(token.left), derive(token.right))
    }
    else if (token.type === "/")
    {
        return new Token
        (
            "/",
            undefined,
            new Token
            (
                "-",
                undefined,
                new Token("*", undefined, derive(token.left), token.right.deepCopy()),
                new Token("*", undefined, token.left.deepCopy(), derive(token.right))
            ),
            new Token("^", undefined, token.right.deepCopy(), new Token("number", 2))
        )
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
        else if (token.left.type === "identifier" && token.left.value === "e")
        {
            return new Token("*", undefined, token.deepCopy(), derive(token.right))
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
    else if (token.type === "~")
    {
        return new Token("~", undefined, undefined, derive(token.right))
    }
}
