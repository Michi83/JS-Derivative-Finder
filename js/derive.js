/*
 * The basic idea of this script is to construct a syntax tree from a
 * mathematical expression and to apply differentiation rules to it. Also some
 * algebraic simplifications are applied.
 */

/*
 * The basic building block of syntax trees. The attributes left and right are
 * meant to be other tokens or undefined.
 */
var Token = function(type, value, left, right)
{
    this.setAttributes(type, value, left, right)
}

Token.prototype =
{
    copyAttributesFrom: function(that)
    {
        this.setAttributes(that.type, that.value, that.left, that.right)
    },
    
    deepCopy: function()
    {
        var left
        var right
        if (this.left !== undefined)
        {
            left = this.left.deepCopy()
        }
        if (this.right !== undefined)
        {
            right = this.right.deepCopy()
        }
        return new Token(this.type, this.value, left, right)
    },
    
    setAttributes: function(type, value, left, right)
    {
        this.type = type
        this.value = value
        this.left = left
        this.right = right
    },
    
    /*
     * Determines if this token is the root of a constant subtree (i.e. a
     * subtree that does not contain the identifier x)
     */
    isConstant: function()
    {
        if (this.type === "identifier" && this.value === "x")
        {
            return false
        }
        if (this.left !== undefined && !this.left.isConstant())
        {
            return false
        }
        if (this.right !== undefined && !this.right.isConstant())
        {
            return false
        }
        return true
    }
}

/*
 * Decomposes an expression string. Usage: Create a new Tokenizer object and
 * repeatedly call its nextToken method, e.g.
 * var tokenizer = new Tokenizer("2 * x")
 * tokenizer.nextToken() --> 2
 * tokenizer.nextToken() --> *
 * tokenizer.nextToken() --> x
 * tokenizer.nextToken() --> end
 */
var Tokenizer = function(expression)
{
    this.expression = expression + "\0"
    this.to = 0
}

Tokenizer.prototype =
{
    nextToken: function()
    {
        this.from = this.to
        // end
        if (this.expression.charAt(this.to) === "\0")
        {
            this.to++
            return new Token("end")
        }
        // identifiers
        else if (this.expression.charAt(this.to) >= "A" && this.expression.charAt(this.to) <= "Z" || this.expression.charAt(this.to) === "_" || this.expression.charAt(this.to) >= "a" && this.expression.charAt(this.to) <= "z")
        {
            this.to++
            while (this.expression.charAt(this.to) >= "0" && this.expression.charAt(this.to) <= "9" || this.expression.charAt(this.to) >= "A" && this.expression.charAt(this.to) <= "Z" || this.expression.charAt(this.to) === "_" || this.expression.charAt(this.to) >= "a" && this.expression.charAt(this.to) <= "z")
            {
                this.to++
            }
            return new Token("identifier", this.expression.substring(this.from, this.to))
        }
        // numbers
        else if (this.expression.charAt(this.to) >= "0" && this.expression.charAt(this.to) <= "9")
        {
            this.to++
            while (this.expression.charAt(this.to) >= "0" && this.expression.charAt(this.to) <= "9")
            {
                this.to++
            }
            if (this.expression.charAt(this.to) === ".")
            {
                this.to++
                if (this.expression.charAt(this.to) >= "0" && this.expression.charAt(this.to) <= "9")
                {
                    this.to++
                    while (this.expression.charAt(this.to) >= "0" && this.expression.charAt(this.to) <= "9")
                    {
                        this.to++
                    }
                }
                else
                {
                    throw "unrecognized token " + this.expression.substring(this.from, this.to)
                }
            }
            if (this.expression.charAt(this.to) === "E" || this.expression.charAt(this.to) === "e")
            {
                this.to++
                if (this.expression.charAt(this.to) === "+" || this.expression.charAt(this.to) === "-")
                {
                    this.to++
                }
                if (this.expression.charAt(this.to) >= "0" && this.expression.charAt(this.to) <= "9")
                {
                    this.to++
                    while (this.expression.charAt(this.to) >= "0" && this.expression.charAt(this.to) <= "9")
                    {
                        this.to++
                    }
                }
                else
                {
                    throw "unrecognized token " + this.expression.substring(this.from, this.to)
                }
            }
            return new Token("number", parseFloat(this.expression.substring(this.from, this.to)))
        }
        // one char tokens
        else if (this.expression.charAt(this.to) >= "(" && this.expression.charAt(this.to) <= "+" || this.expression.charAt(this.to) === "-" || this.expression.charAt(this.to) === "/" || this.expression.charAt(this.to) === "^")
        {
            this.to++
            return new Token(this.expression.charAt(this.from))
        }
        // whitespace
        else if (this.expression.charAt(this.to) >= "\t" && this.expression.charAt(this.to) <= "\r" || this.expression.charAt(this.to) === " ")
        {
            this.to++
            while (this.expression.charAt(this.to) >= "\t" && this.expression.charAt(this.to) <= "\r" || this.expression.charAt(this.to) === " ")
            {
                this.to++
            }
            return this.nextToken()
        }
        else
        {
            throw "unrecognized token " + this.expression.charAt(this.to)
        }
    }
}

/*
 * Constructs a syntax tree using recursive descent.
 */
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
            return power()
        }
    }
    
    var power = function()
    {
        var token = function_()
        if (lookahead.type === "^")
        {
            lookahead.left = token
            token = advance()
            token.right = sign()
        }
        return token
    }
    
    var function_ = function()
    {
        var token = factor()
        if (lookahead.type === "(")
        {
            lookahead.left = token
            token = advance()
            token.right = sum()
            advance(")")
        }
        return token
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

/*
 * The unparse function needs this to determine when to put parentheses around a
 * subexpression.
 */
var precedence =
{
    "*": 1,
    "+": 0,
    "-": 0,
    "/": 1,
    "^": 3,
    "identifier": 4,
    "number": 4,
    "~": 2
}

/*
 * Generates an expression string from a syntax tree.
 */
var unparse = function(token)
{
    // ()
    if (token.type === "(")
    {
        var left = unparse(token.left)
        var right = unparse(token.right)
        return left + "(" + right + ")"
    }
    // *
    else if (token.type === "*")
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
        if (precedence[token.right.type] < 1)
        {
            right = "(" + right + ")"
        }
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
        if (precedence[token.right.type] < 2)
        {
            right = "(" + right + ")"
        }
        return left + " / " + right
    }
    // ^
    else if (token.type === "^")
    {
        var left = unparse(token.left)
        var right = unparse(token.right)
        if (precedence[token.left.type] < 4)
        {
            left = "(" + left + ")"
        }
        if (precedence[token.right.type] < 3)
        {
            right = "(" + right + ")"
        }
        return left + "^" + right
    }
    // identifiers
    else if (token.type === "identifier")
    {
        return token.value
    }
    // numbers
    else if (token.type === "number")
    {
        return token.value + ""
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
    if (token.type === "(")
    {
        if (token.left.type !== "identifier")
        {
            throw "function names must be identifiers"
        }
        if (token.left.value === "sin")
        {
            var right = unparse(token.right)
            if (right === "0")
            {
                token.setAttributes("number", 0)
                return
            }
            else if (right === "pi / 2")
            {
                token.setAttributes("number", 1)
                return
            }
            else if (right === "pi")
            {
                token.setAttributes("number", 0)
                return
            }
            else if (right === "3 * pi / 2")
            {
                token.setAttributes("number", -1)
                return
            }
        }
        else if (token.left.value === "cos")
        {
            var right = unparse(token.right)
            if (right === "0")
            {
                token.setAttributes("number", 1)
                return
            }
            else if (right === "pi / 2")
            {
                token.setAttributes("number", 0)
                return
            }
            else if (right === "pi")
            {
                token.setAttributes("number", -1)
                return
            }
            else if (right === "3 * pi / 2")
            {
                token.setAttributes("number", 0)
                return
            }
        }
        else if (token.left.value === "tan")
        {
            var right = unparse(token.right)
            if (right === "0")
            {
                token.setAttributes("number", 0)
                return
            }
            else if (right === "pi")
            {
                token.setAttributes("number", 0)
                return
            }
        }
        else if (token.left.value === "ln")
        {
            var right = unparse(token.right)
            if (right === "1")
            {
                token.setAttributes("number", 0)
                return
            }
            else if (right === "e")
            {
                token.setAttributes("number", 1)
                return
            }
        }
    }
    else if (token.type === "*")
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
            var euclid = function(a, b)
            {
                while (b !== 0)
                {
                    var temp = b
                    b = a % b
                    a = temp
                }
                return a
            }
            var gcd = euclid(token.left.value, token.right.value)
            if (Math.sign(gcd) !== Math.sign(token.right.value))
            {
                gcd = -gcd
            }
            if (gcd === token.right.value)
            {
                token.setAttributes("number", token.left.value / token.right.value)
            }
            else
            {
                token.left.setAttributes("number", token.left.value / gcd)
                token.right.setAttributes("number", token.right.value / gcd)
            }
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
            throw "function names must be identifiers"
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
                "/",
                undefined,
                derive(token.right),
                new Token
                (
                    "^",
                    undefined,
                    new Token("(", undefined, new Token("identifier", "cos"), token.right.deepCopy()),
                    new Token("number", 2)
                )
            )
        }
        // asin
        else if (token.left.value === "asin")
        {
            return new Token
            (
                "/",
                undefined,
                derive(token.right),
                new Token
                (
                    "(",
                    undefined,
                    new Token("identifier", "sqrt"),
                    new Token
                    (
                        "-",
                        undefined,
                        new Token("number", 1),
                        new Token
                        (
                            "^",
                            undefined,
                            token.right.deepCopy(),
                            new Token("number", 2)
                        )
                    )
                )
            )
        }
        // acos
        else if (token.left.value === "acos")
        {
            return new Token
            (
                "/",
                undefined,
                new Token("~", undefined, undefined, derive(token.right)),
                new Token
                (
                    "(",
                    undefined,
                    new Token("identifier", "sqrt"),
                    new Token
                    (
                        "-",
                        undefined,
                        new Token("number", 1),
                        new Token
                        (
                            "^",
                            undefined,
                            token.right.deepCopy(),
                            new Token("number", 2)
                        )
                    )
                )
            )
        }
        // atan
        else if (token.left.value === "atan")
        {
            return new Token
            (
                "/",
                undefined,
                derive(token.right),
                new Token
                (
                    "+",
                    undefined,
                    new Token("number", 1),
                    new Token
                    (
                        "^",
                        undefined,
                        token.right.deepCopy(),
                        new Token("number", 2)
                    )
                )
            )
        }
        // sinh
        else if (token.left.value === "sinh")
        {
            return new Token
            (
                "*",
                undefined,
                new Token
                (
                    "(",
                    undefined,
                    new Token("identifier", "cosh"),
                    token.right.deepCopy()
                ),
                derive(token.right)
            )
        }
        // cosh
        else if (token.left.value === "cosh")
        {
            return new Token
            (
                "*",
                undefined,
                new Token
                (
                    "(",
                    undefined,
                    new Token("identifier", "sinh"),
                    token.right.deepCopy()
                ),
                derive(token.right)
            )
        }
        // tanh
        else if (token.left.value === "tanh")
        {
            return new Token
            (
                "/",
                undefined,
                derive(token.right),
                new Token
                (
                    "^",
                    undefined,
                    new Token
                    (
                        "(",
                        undefined,
                        new Token("identifier", "cosh"),
                        token.right.deepCopy()
                    ),
                    new Token("number", 2)
                )
            )
        }
        // square root
        else if (token.left.value === "sqrt")
        {
            return new Token
            (
                "/",
                undefined,
                derive(token.right),
                new Token
                (
                    "*",
                    undefined,
                    new Token("number", 2),
                    token.deepCopy()
                )
            )
        }
        // natural logarithm
        else if (token.left.value === "ln")
        {
            return new Token
            (
                "/",
                undefined,
                derive(token.right),
                token.right.deepCopy()
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
        // f(x)^c --> c * f(x)^(c - 1) * f'(x)
        if (token.right.isConstant())
        {
            return new Token
            (
                "*",
                undefined,
                new Token
                (
                    "*",
                    undefined,
                    token.right.deepCopy(),
                    new Token
                    (
                        "^",
                        undefined,
                        token.left.deepCopy(),
                        new Token("-", undefined, token.right.deepCopy(), new Token("number", 1))
                    )
                ),
                derive(token.left)
            )
        }
        // c^f(x) --> c^f(x) * ln(c) * f'(x)
        else if (token.left.isConstant())
        {
            return new Token
            (
                "*",
                undefined,
                new Token
                (
                    "*",
                    undefined,
                    token.deepCopy(),
                    new Token("(", undefined, new Token("identifier", "ln"), token.left.deepCopy())
                ),
                derive(token.right)
            )
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
    simplify(token)
    token = derive(token)
    // Now we unparse the syntax tree and parse it right back. This seems stupid
    // but sometimes it "cleans" the syntax tree making it easier for simplify
    // to digest.
    token = parse(unparse(token))
    simplify(token)
    return unparse(token)
}
