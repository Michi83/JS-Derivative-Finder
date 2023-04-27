let deriveButton = document.querySelector("#derive-button")
let deriveInput = document.querySelector("#derive-input")
let deriveOutput = document.querySelector("#derive-output")

deriveButton.addEventListener(
    "click",
    () => {
        try {
            let expression = deriveInput.value
            let derivative = derive(expression)
            deriveOutput.textContent = derivative
        } catch (e) {
            deriveOutput.textContent = `ERROR: ${e}`
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