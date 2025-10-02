// JavaScript to handle the radio button selections and form submission
const addressRadios = document.querySelectorAll('.address-radio');
const paymentRadios = document.querySelectorAll('.payment-radio');
const confirmOrderButton = document.getElementById('confirmOrderButton');
const orderForm = document.getElementById('orderForm');


confirmOrderButton.addEventListener('click', async () => {
    const selectedAddressElement = document.querySelector('input[name="selectedAddress"]:checked');
    const selectedAddress = selectedAddressElement ? selectedAddressElement.value : null;
    function getSelectedPayment() {
        for (const radio of paymentRadios) {
            if (radio.checked) {
                return radio.value;
            }
        }
    }
    const selectedPayment = getSelectedPayment();
    console.log('selected address ====', selectedAddress, ", selected payment ====", selectedPayment)

    if (!selectedAddress) {
        alert('Please select a delivery address before confirming your order.');
    } else {
        // Submit the form
        orderForm.submit();
        const res = await fetch('/placeOrder', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                selectedAddress,
                selectedPayment
            })
        })
        const data = await res.json();
        if (data.success) {
            console.log("success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================")
            if (selectedPayment == "cod") {
                window.location.href = '/placeOrder';
            } else if (selectedPayment == 'online' && data.orderId) {
                console.log("razorpayId===", data.orderId);
            }
        }
        const orderId = data.orderId;
        console.log(orderId);
        $("button").show();
    }
});

addressRadios.forEach(addressRadio => {
    addressRadio.addEventListener('change', () => {
        // Unselect other address radios
        addressRadios.forEach(radio => {
            if (radio !== addressRadio) {
                radio.checked = false;
            }
        });
    });
});

paymentRadios.forEach(paymentRadio => {
    paymentRadio.addEventListener('change', () => {
        // Unselect other payment radios
        paymentRadios.forEach(radio => {
            if (radio !== paymentRadio) {
                radio.checked = false;
            }
        });
    });
});

// Function to get the selected value

