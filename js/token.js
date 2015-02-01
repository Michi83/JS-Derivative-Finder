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
    }
}
