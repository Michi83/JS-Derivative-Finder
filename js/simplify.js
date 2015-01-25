var simplify = function(token)
{
    if (token === undefined)
    {
        return
    }
    simplify(token.left)
    simplify(token.right)
    if (token.type === "*")
    {
        if (token.left.type === "number")
        {
            if (token.left.value === 0)
            {
                token.setAttributes("number", 0)
                return
            }
            else if (token.left.value === 1)
            {
                token.copyAttributesFrom(token.right)
                return
            }
        }
        if (token.right.type === "number")
        {
            if (token.right.value === 0)
            {
                token.setAttributes("number", 0)
                return
            }
            else if (token.right.value === 1)
            {
                token.copyAttributesFrom(token.left)
                return
            }
        }
    }
    if (token.type === "+")
    {
        if (token.left.type === "number")
        {
            if (token.left.value === 0)
            {
                token.copyAttributesFrom(token.right)
                return
            }
        }
        if (token.right.type === "number")
        {
            if (token.right.value === 0)
            {
                token.copyAttributesFrom(token.left)
                return
            }
        }
    }
    if (token.type === "-")
    {
        if (token.left.type === "number")
        {
            if (token.left.value === 0)
            {
                token.setAttributes("~", undefined, undefined, token.right)
                return
            }
        }
        if (token.right.type === "number")
        {
            if (token.right.value === 0)
            {
                token.copyAttributesFrom(token.left)
                return
            }
        }
    }
    if (token.type === "/")
    {
        if (token.left.type === "number")
        {
            if (token.left.value === 0)
            {
                token.setAttributes("number", 0)
                return
            }
        }
        if (token.right.type === "number")
        {
            if (token.right.value === 1)
            {
                token.copyAttributesFrom(token.left)
                return
            }
        }
    }
    if (token.type === "~")
    {
        if (token.right.type === "number")
        {
            if (token.right.value === 0)
            {
                token.copyAttributesFrom(token.right)
                return
            }
        }
    }
}
