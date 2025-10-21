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



    $('#smt').submit(async (event) => {
        event.preventDefault();
        // console.log("clicked");;

        var email = $('#email').val()
        var password = $('#password').val()
        let res = await fetch('/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password, email
            })
        })
        let result = await res.json()
        console.log('result = ',result)
        if (result.success) {
            window.location.href = '/'
        } else {
            // $('#disapear').html(data.err)
            $('#disapear').css('display', 'block')
            const disappearElement = document.getElementById('disapear');
            disappearElement.innerHTML = result.message
            if (disappearElement) {
                setTimeout(function () {
                    disappearElement.innerHTML = ""
                    disappearElement.style.display = "none";
                }, 3000);
            }
        }

    })
})
