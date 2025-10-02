const err = document.getElementById('disap')
if (err) {
    err.style.display = 'block'
    setTimeout(() => {
        err.innerHTML = "";
        err.style.display = 'none'
    }, 4000)
}