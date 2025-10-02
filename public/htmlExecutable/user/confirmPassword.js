document.getElementById('register-form').addEventListener("submit", (e) => {
    let Pass = document.getElementById('Pass').value
    let Cpass = document.getElementById('Cpass').value
    //---------------------------------------------------
    if (Pass === Cpass && Pass.length >= 8 && /[a-zA-Z]/.test(Pass) && /\d/.test(Pass) && /[!@#$%^&*()_+{}\[\]:;<>,.?~\\\-]/.test(Pass) && !/\s/.test(Pass)) {
        return true
    } else {
        e.preventDefault()
        document.getElementById('alertDiv').style.display = "block";
        document.getElementById('alertDiv').innerHTML = "Password must contain at least 8 characters, including one alphabetic letter, one number, one special character, and no spaces. Passwords must also match.";


        // Hide the error message after 5 seconds
        setTimeout(function () {
            document.getElementById('alertDiv').style.display = "none";
        }, 4000);
    }
    //--------------------------------------------------------
})
let errr = document.getElementById('error')
if (errr) {

    errr.style.display = 'block'
    // errr.innerHTML = 'user doesnot exist'
    setTimeout(() => {
        // errr.innerHTML = ''
        errr.style.display = 'none'
    }, 4000)
} 
