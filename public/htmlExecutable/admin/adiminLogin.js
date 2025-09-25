$(document).ready(function () {
    $('#submit').submit(async (event) => {
        event.preventDefault()
        try {
            let email = $('#email').val()
            let password = $('#password').val()
            console.log("email-", email, "password-", password)
            let res = await fetch('/admin/login', {
                method: 'POST',
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })
            let result = await res.json()
            console.log(result)
            if (result.success) {
                window.location.href = '/admin/Customers'
            } else {
                let dis = $('#disapear')
                dis.text('wrong username or password');
                dis.show()
                setTimeout(function () {
                    dis.hide()
                }, 4000);
            }              
        } catch (error) {
            console.log(error.message)
        }

    })
})