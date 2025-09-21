 setTimeout(function () {
            document.getElementById('disapear').style.display = "none";
        }, 4000);



        let timeInSeconds = sessionStorage.getItem('otpTimer') || 60;

    function updateTimer(){
        const timerElement = document.querySelector('.timer');
        timerElement.textContent = `00:${timeInSeconds.toString().padStart(2, '0')}`;
        timeInSeconds--;

        if (timeInSeconds < 0){
            clearInterval(timerInterval);
            displayResendButton();
        }
    }

    function displayResendButton() {
        const resendButton = document.querySelector('.resend-otp');
        resendButton.style.display = 'block';
    }

    function resendOTP() {
  
        timeInSeconds = 60;
        document.querySelector('.timer').textContent = '00:60';
        document.querySelector('.resend-otp').style.display = 'none';
        timerInterval = setInterval(updateTimer, 1000);
        sessionStorage.setItem('otpTimer', timeInSeconds);

    }

    const timerInterval = setInterval(updateTimer, 1000);

    // Clear sessionStorage when the page is loaded initially
    window.onload = function () {
        sessionStorage.removeItem('otpTimer');
    };

    // Clear sessionStorage when the page is closed or refreshed
    window.onbeforeunload = function () {
        sessionStorage.removeItem('otpTimer');
    };
