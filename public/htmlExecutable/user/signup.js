const userName = document.getElementById('name')
const nameError = document.getElementById('nameErr')
const email = document.getElementById('email')
const emailError = document.getElementById('emailErr')
const password = document.getElementById('password')
const passwordError = document.getElementById('passwordErr')
const confirmPassword = document.getElementById('confirmPassword')
const confirmPasswordError = document.getElementById('confirmPasswordErr')
const alertDiv = document.getElementById('alertDiv')

let errorObject = {
    nameErr: false,
    emailErr: false,
    passwordErr: false,
    confirmPasswordErr: false
}

function checkName() {
    let enteredName = userName.value
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(enteredName)) {
        errorObject.nameErr = true
        nameError.style.display = 'grid'
        nameError.innerHTML = "only alphanumeric charactors allowed"
    } else {
        errorObject.nameErr = false
        nameError.style.display = 'none'
        nameError.innerHTML = ""
    }

}

function checkEmail() {
    let enteredEmail = email.value
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(enteredEmail)) {
        errorObject.emailErr = true
        emailError.style.display = 'grid'
        emailError.innerHTML = "enter a valid email"
    } else {
        errorObject.emailErr = false
        emailError.style.display = 'none'
        emailError.innerHTML = "only alphanumeric charactors allowed"

    }
}


function checkPassword() {
    let enteredPassword
    let passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    enteredPassword = password.value
    console.log('pass')
    if (!passRegex.test(enteredPassword)) {
        errorObject.passwordErr = true
        passwordError.style.display = 'grid'
        passwordError.innerHTML = 'need symbol,cap-letter,sm-letter and a number. atleast 8 characters'
    } else if (password.value !== confirmPassword.value) {
        confirmPasswordError.style.display = 'grid'
        confirmPasswordError.innerHTML = 'password mismatch'
        passwordError.style.display = 'grid'
        passwordError.innerHTML = 'password mismatch'
        errorObject.passwordErr = true
        errorObject.confirmPasswordErr = true

    } else if (password.value == confirmPassword.value) {
        confirmPasswordError.style.display = 'none'
        confirmPasswordError.innerHTML = ''
        passwordError.style.display = 'none'
        passwordError.innerHTML = ''
        errorObject.passwordErr = false
        errorObject.confirmPasswordErr = false
    } else {
        passwordError.style.display = 'none'
        passwordError.innerHTML = ''
        errorObject.passwordErr = false
    }

}
function checkConfirmPassword() {
    let passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    let enteredPassword = confirmPassword.value
    console.log('conpass')
    if (!passRegex.test(enteredPassword)) {
        errorObject.confirmPasswordErr = true
        confirmPasswordError.style.display = 'grid'
        confirmPasswordError.innerHTML = 'need symbol,cap-letter,sm-letter and a number. atleast 8 characters'
    } else if (password.value !== confirmPassword.value) {
        confirmPasswordError.style.display = 'grid'
        confirmPasswordError.innerHTML = 'password mismatch'
        passwordError.style.display = 'grid'
        passwordError.innerHTML = 'password mismatch'
        errorObject.passwordErr = true
        errorObject.confirmPasswordErr = true
    } else if (password.value == confirmPassword.value) {
        confirmPasswordError.style.display = 'none'
        confirmPasswordError.innerHTML = ''
        passwordError.style.display = 'none'
        passwordError.innerHTML = ''
        errorObject.passwordErr = false
        errorObject.confirmPasswordErr = false
    } else {
        confirmPasswordError.style.display = 'none '
        confirmPasswordError.innerHTML = ''
        errorObject.confirmPasswordErr = false
    }
}



$(document).ready(function () {

    $(".toggle-password").click(function () {
        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $(this).siblings("input");
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

    var disappearElement = document.getElementById('disapear');
    if (disappearElement) {
        setTimeout(function () {
            disappearElement.style.display = "none";
        }, 4000);
    }
});

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    console.log('submiting...')
    let errorIn
    for(let key in errorObject){
        if(errorObject[key]){
            errorIn = key
            break;
        }
    }
    if(errorIn){
        alertDiv.style.display = 'grid'
        alertDiv.innerHTML = `fill all the fields or correct the incorrect fields`
        setTimeout(function(){
            alertDiv.style.display = 'none'
            alertDiv.innerHTML = ""
        },4000)
    }
})

setTimeout(function () {
    var message = document.getElementById('disapear');
    if (message) {
        message.style.display = 'none';
    }
}, 4000);