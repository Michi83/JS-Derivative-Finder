/*
 * Derives a syntax tree. Call it on the root token and recursion will take care
 * of the entire tree. Note that this functions constructs a new tree instead of
 * modifying the original tree.
 */
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
        // tangent
        else if (token.left.value === "tan")
        {
            return new Token
            (
                "*",
                undefined,
                new Token
                (
                    "/",
                    undefined,
                    new Token("number", 1),
                    new Token
                    (
                        "^",
                        undefined,
                        new Token("(", undefined, new Token("identifier", "cos"), token.right.deepCopy()),
                        new Token("number", 2)
                    )
                ),
                derive(token.right)
            )
        }
        // natural logarithm
        else if (token.left.value === "ln")
        {
            return new Token
            (
                "*",
                undefined,
                new Token("/", undefined, new Token("number", 1), token.right.deepCopy()),
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

/*
 * Derives an expression string and returns the derivative as a string.
 */
var deriveExpression = function(expression)
{
    var token = parse(expression)
    token = derive(token)
    // Now we unparse the syntax tree and parse it right back. This seems stupid
    // but sometimes it "cleans" the syntax tree making it easier for simplify
    // to digest.
    var temp = unparse(token)
    token = parse(temp)
    simplify(token)
    return unparse(token)
}
