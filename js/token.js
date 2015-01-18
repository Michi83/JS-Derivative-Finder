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
    
    setAttributes: function(type, value, left, right)
    {
        this.type = type
        this.value = value
        this.left = left
        this.right = right
    }
}
