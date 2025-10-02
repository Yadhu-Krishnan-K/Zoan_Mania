function clicker() {
    const oldPass = $('#show_hide_password').text()

    const Pass = document.getElementById('Pass').value
    if (Pass == "") {
        document.getElementById('passAlert').style.display = 'block'
    }
    console.log("inside function pass===", Pass)
    const conPass = document.getElementById('conPass').value
    if (conPass == "") {
        document.getElementById('conAlert').style.display = 'block'

    }
    if (Pass == conPass && Pass !== "" && conPass !== "") {
        fetch(
            "/checkPasswords",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    oldPass,
                    Pass
                })
            }
        )
            .then(res => res.json())
            .then((data) => {
                // console.log(data);
                if (data.success) {
                    alert("Password changed successfully")
                    window.location.replace('/profile');
                }
                else if (!(data.success) && data.notfound) {
                    alert('Enter the correct old password')
                } else if (!(data.success) && data.errors) {
                    alert("error", data.errors)
                }

            })

    } else {
        document.getElementById('errorAlert').innerHTML = 'Password missmatch'
        document.getElementById('errorAlert').style.display = 'block'

    }

}
