const userName = document.getElementById('name')
const nameError = document.getElementById('nameErr')
const email = document.getElementById('email')
const emailError = document.getElementById('emailErr')
const password = document.getElementById('password')
const passwordError = document.getElementById('passwordErr')
const confirmPassword = document.getElementById('confirmPassword')
const confirmPasswordError = document.getElementById('confirmPasswordErr')


function checkName() {
    let enteredName = userName.value
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if(!alphanumericRegex.test(enteredName)){
        nameError.style.display = 'grid'
        nameError.innerHTML = "only alphanumeric charactors allowed"
    }else{
        nameError.style.display = 'none'
        nameError.innerHTML = ""
    }
    
}

function checkEmail(){
    let enteredEmail = email.value
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(enteredEmail)){
        emailError.style.display = 'grid'
        emailError.innerHTML = "enter a valid email"
    }else {
        emailError.style.display = 'none'
        emailError.innerHTML = "only alphanumeric charactors allowed"
    
    }
}


function checkPassword(pass){
    let enteredPassword
    let passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if(pass==='confirm'){
        enteredPassword = confirmPassword.value
        console.log('conpass')
        
    }else{
        enteredPassword = password.value
        console.log('pass')
    }
}









































       
//        $(document).ready(function () {

//             $(".toggle-password").click(function () {
//                 $(this).toggleClass("fa-eye fa-eye-slash");
//                 var input = $(this).siblings("input");
//                 if (input.attr("type") == "password") {
//                     input.attr("type", "text");
//                 } else {
//                     input.attr("type", "password");
//                 }
//             });

//             var disappearElement = document.getElementById('disapear');
//             if (disappearElement) {
//                 setTimeout(function () {
//                     disappearElement.style.display = "none";
//                 }, 4000);
//             }
//         });

        
//     function checkPass(){
//         document.getElementById("for-password").addEventListener("submit", function (event) {
        
//         var password = document.getElementById('password').value;
//         var username = document.getElementById('name').value;
//         // var usernamePattern = /^[^\s]+$/;

       
//             console.log(username)
// //-----------------------------------------------------------------------------------------------------------------
//         var confirmPassword = document.getElementById('confirmPassword').value;

//         if(/^[  \s]+$/.test(username)){
//             event.preventDefault()
//             document.getElementById('alertDiv').style.display = "block";
//             document.getElementById('alertDiv').innerHTML = "should not contain any spaces user name";
//         // alertDiv.style.display = "block";

//         // Hide the error message after 5 seconds
//         setTimeout(function () {
//             document.getElementById('alertDiv').style.display = "none";
//         }, 5000);
//         }
//         //-----------------------------------------------------------------------------------------
//         if(/\s/.test(username) || /\d/.test(username) || /[!@#$%^&*()_+{}\[\]:;<>,.?~\\\-]/.test(username)){
//             event.preventDefault()
//             document.getElementById('alertDiv').style.display = "block";
//             document.getElementById('alertDiv').innerHTML = "Check your user name";
//         // alertDiv.style.display = "block";

//         // Hide the error message after 5 seconds
//         setTimeout(function () {
//             document.getElementById('alertDiv').style.display = "none";
//         }, 5000);
//         }
// //------------------------------------------------------------------------------------------------------------
//         //email validation





// //=======================================================================================================
//         if(password===confirmPassword && password.length>=8 && /[a-zA-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()_+{}\[\]:;<>,.?~\\\-]/.test(password) && !/\s/.test(password)){
            
//         }else{
//             event.preventDefault()
//             document.getElementById('alertDiv').style.display = "block";
//             document.getElementById('alertDiv').innerHTML = "Password must contain at least 8 characters, including one alphabetic letter, one number, one special character, and no spaces. Passwords must also match.";
//         // alertDiv.style.display = "block";

//         // Hide the error message after 5 seconds
//         setTimeout(function () {
//             document.getElementById('alertDiv').style.display = "none";
//         }, 5000);
//         }

//     })
// //----------------------------------------------------------------------------------------------------------

//     }
//     setTimeout(function() {
//             var message = document.getElementById('disapear');
//             if (message) {
//                 message.style.display = 'none';
//             }
//         }, 4000);

