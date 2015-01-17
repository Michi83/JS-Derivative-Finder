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
        else if (this.expression.charAt(this.to) >= "(" && this.expression.charAt(this.to) <= "+" || this.expression.charAt(this.to) === "-" || this.expression.charAt(this.to) === "/")
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
