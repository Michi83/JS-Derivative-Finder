let deriveButton = document.querySelector("#derive-button")
let deriveInput = document.querySelector("#derive-input")
let deriveOutput = document.querySelector("#derive-output")
let deriveAgainButton = document.querySelector("#derive-again-button")

deriveButton.addEventListener(
    "click",
    () => {
        try {
            let expression = deriveInput.value
            let derivative = derive(expression)
            deriveOutput.textContent = `f'(x) = ${derivative}`
            deriveAgainButton.style.display = "initial"
            canvas.style.display = "initial"
            wipeCanvas()
            plot(expression, "#0000FF")
            plot(derivative, "#FF0000")
        } catch (e) {
            deriveOutput.textContent = `ERROR: ${e}`
            deriveAgainButton.style.display = "none"
            canvas.style.display = "none"
            console.log(e)
        }
    }
)

deriveInput.addEventListener(
    "keydown",
    (e) => {
        if (e.code == "Enter" || e.code == "NumpadEnter") {
            deriveButton.click()
        }
    }
)

deriveAgainButton.addEventListener(
    "click",
    () => {
        deriveInput.value = deriveOutput.textContent.substring(8)
        deriveButton.click()
    }
)

let canvas = document.querySelector("#main-canvas")
let context = canvas.getContext("2d")

let drawLine = (x1, y1, x2, y2) => {
    x1 = (x1 + 5) / 10 * canvas.width
    y1 = (5 - y1) / 10 * canvas.height
    x2 = (x2 + 5) / 10 * canvas.width
    y2 = (5 - y2) / 10 * canvas.height
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.stroke()
}

let wipeCanvas = () => {
    context.fillStyle = "#FFFFFF"
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.lineWidth = 1
    context.strokeStyle = "#C0C0C0"
    for (let i = -5; i <= 5; i++) {
        drawLine(-5, i, 5, i)
        drawLine(i, 5, i, -5)
    }
    context.strokeStyle = "#000000"
    drawLine(-5, 0, 5, 0)
    drawLine(0, 5, 0, -5)
}

let step = 1 / 16
let threshold = 64

let plot = (expression, color) => {
    let root = parse(expression)
    let x1 = -5
    let y1 = evaluateToken(root, x1)
    context.lineWidth = 2
    context.strokeStyle = color
    for (let x2 = x1 + step; x2 <= 5; x2 += step) {
        let y2 = evaluateToken(root, x2)
        if (Math.abs(y1 - y2) <= threshold) {
            drawLine(x1, y1, x2, y2)
        }
        x1 = x2
        y1 = y2
    }
}