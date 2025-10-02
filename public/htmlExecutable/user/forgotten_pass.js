let errr = document.getElementById('err')
if (errr) {

    errr.style.display = 'block'
    // errr.innerHTML = 'user doesnot exist'
    setTimeout(() => {
        // errr.innerHTML = ''
        errr.style.display = 'none'
    }, 4000)
} 
