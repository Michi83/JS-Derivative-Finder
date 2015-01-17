var precedence =
{
    "*": 1,
    "+": 0,
    "-": 0,
    "/": 1,
    "identifier": 3,
    "number": 3,
    "~": 2
}

var unparse = function(token)
{
    // *
    if (token.type === "*")
    {
        var left = unparse(token.left)
        var right = unparse(token.right)
        if (precedence[token.left.type] < 1)
        {
            left = "(" + left + ")"
        }
        if (precedence[token.right.type] < 1)
        {
            right = "(" + right + ")"
        }
        return left + " * " + right
    }
    // +
    else if (token.type === "+")
    {
        var left = unparse(token.left)
        var right = unparse(token.right)
        return left + " + " + right
    }
    // -
    else if (token.type === "-")
    {
        var left = unparse(token.left)
        var right = unparse(token.right)
        return left + " - " + right
    }
    // /
    else if (token.type === "/")
    {
        var left = unparse(token.left)
        var right = unparse(token.right)
        if (precedence[token.left.type] < 1)
        {
            left = "(" + left + ")"
        }
        if (precedence[token.right.type] < 1)
        {
            right = "(" + right + ")"
        }
        return left + " / " + right
    }
    // identifiers
    else if (token.type === "identifier")
    {
        return token.value
    }
    // numbers
    else if (token.type === "number")
    {
        return token.value
    }
    // ~
    else if (token.type === "~")
    {
        var right = unparse(token.right)
        if (precedence[token.right.type] < 2)
        {
            right = "(" + right + ")"
        }
        return "-" + right
    }
    else
    {
        throw "unexpected " + token.type
    }
}
