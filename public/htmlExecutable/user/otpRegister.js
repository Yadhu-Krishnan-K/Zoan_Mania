const form = document.getElementById('submit-form')
const otpINp = document.getElementById('otp')
const otpErr = document.getElementById('otpErr')
const alertDiv = document.getElementById('alert')

form.addEventListener('submit',async(e)=>{
    e.preventDefault()
    try {
        let otp = otpINp.value;
        if(otp.value == ""){
            otpErr.innerHTML = "Enter otp";
            otpErr.style.display = "grid"
            setTimeout(()=>{
                otpErr.innerHTML = "";
                otpErr.style.display = ""
            },3000)
            return;
        }
        let res = await fetch('/otp',{
            method: 'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(otp)
        })
        let result = res.json()
        if(result.success){
            window.location.href = result.url
        }else if(result.hasOwnProperty('url')){
            window.location.href = result.url
        }else{
            alertDiv.innerHTML = result.message;
            alertDiv.style.display = "grid"
            setTimeout(()=>{
                alertDiv.innerHTML = "";
                alertDiv.style.display = ""
            },3000)
            return;
        }
    } catch (error) {
        console.log(error.message)
    }
})