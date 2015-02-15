var derive = function(token)
{
    // functions
    if (token.type === "(")
    {
        // left child must be an identifier
        if (token.left.type !== "identifier")
        {
            throw "derivative not implemented"
        }
        // sine
        if (token.left.value === "sin")
        {
            return new Token
            (
                "*",
                undefined,
                new Token("(", undefined, new Token("identifier", "cos"), token.right.deepCopy()),
                derive(token.right)
            )
        }
        // cosine
        else if (token.left.value === "cos")
        {
            return new Token
            (
                "*",
                undefined,
                new Token
                (
                    "~",
                    undefined,
                    undefined,
                    new Token("(", undefined, new Token("identifier", "sin"), token.right.deepCopy())
                ),
                derive(token.right)
            )
        }
        else
        {
            throw "derivative not implemented"
        }
    }
    // *
    else if (token.type === "*")
    {
        return new Token
        (
            "+",
            undefined,
            new Token("*", undefined, derive(token.left), token.right.deepCopy()),
            new Token("*", undefined, token.left.deepCopy(), derive(token.right))
        )
    }
    // +
    else if (token.type === "+")
    {
        return new Token("+", undefined, derive(token.left), derive(token.right))
    }
    // -
    else if (token.type === "-")
    {
        return new Token("-", undefined, derive(token.left), derive(token.right))
    }
    // /
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
    // ^
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
    // constants
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
    // unary -
    else if (token.type === "~")
    {
        return new Token("~", undefined, undefined, derive(token.right))
    }
    else
    {
        throw "derivative not implemented"
    }
}

var deriveExpression = function(expression)
{
    var token = parse(expression)
    token = derive(token)
    simplify(token)
    return unparse(token)
}
