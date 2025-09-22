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
            console.log(res.body)
            let result = res.json()
            console.log(result)
            if (result.success) {
                window.location.href = '/admin/Customers'
            } else if (!(data.success)) {
                let dis = $('#disapear')
                dis.text('wrong input');
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