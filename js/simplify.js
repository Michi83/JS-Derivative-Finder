/*
 * Applies some algebraic simplification rules to a syntax tree. Note that this
 * function changes the tree, so if you need the original tree, make a deep copy
 * of it.
 */
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
        if (token.left.type === "number" && token.right.type === "number")
        {
            token.setAttributes("number", token.left.value * token.right.value)
            return
        }
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
    else if (token.type === "+")
    {
        if (token.left.type === "number" && token.right.type === "number")
        {
            token.setAttributes("number", token.left.value + token.right.value)
            return
        }
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
    else if (token.type === "-")
    {
        if (token.left.type === "number" && token.right.type === "number")
        {
            token.setAttributes("number", token.left.value - token.right.value)
            return
        }
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
    else if (token.type === "/")
    {
        if (token.left.type === "number" && token.right.type === "number")
        {
            token.setAttributes("number", token.left.value / token.right.value)
            return
        }
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
    else if (token.type === "^")
    {
        if (token.left.type === "number" && token.right.type === "number")
        {
            token.setAttributes("number", Math.pow(token.left.value, token.right.value))
            return
        }
        if (token.left.type === "number")
        {
            if (token.left.value === 0)
            {
                token.setAttributes("number", 0)
                return
            }
            else if (token.left.value === 1)
            {
                token.setAttributes("number", 1)
                return
            }
        }
        if (token.right.type === "number")
        {
            if (token.right.value === 0)
            {
                token.setAttributes("number", 1)
                return
            }
            else if (token.right.value === 1)
            {
                token.copyAttributesFrom(token.left)
                return
            }
        }
    }
    else if (token.type === "~")
    {
        if (token.right.type === "number")
        {
            token.setAttributes("number", -token.right.value)
            return
        }
    }
}
