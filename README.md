# JS Derivative Finder

A simple JavaScript program to find derivatives of functions. Easily embeddable in websites as it does not depend on any JavaScript libraries or server-side code. However, it's not a full-fledged computer algebra system and probably never will be.

## Usage

1. Copy derive.js to your server and include it in your HTML with a script tag.
2. Call deriveExpression on an expression string. Example: deriveExpression("x^2") will return "2 * x"

At the moment the following operators and functions are supported: +, -, *, /, ^, sin, cos, tan, ln
