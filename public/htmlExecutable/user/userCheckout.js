// JavaScript to handle the radio button selections and form submission
const addressRadios = document.querySelectorAll('.address-radio');
const paymentRadios = document.querySelectorAll('.payment-radio');
const confirmOrderButton = document.getElementById('confirmOrderButton');
const orderForm = document.getElementById('orderForm');
const addressCards = document.querySelectorAll('.address-card');



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
        // orderForm.submit();
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
            console.log("success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================success===================================================================================================data from backend = ",data)
            if (selectedPayment == "cod") {
                window.location.href = '/placeOrder';
            } else if (selectedPayment == 'online' && data.order._id) {
                console.log('entering online payment')
                const options = {
                    key: 'rzp_test_nIpzirAhvvMD3T', // Replace with your Razorpay key_id
                    amount: data.order.TotalPrice, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                    currency: 'INR',
                    name: 'Zoan_Mania',
                    description: 'thank you for purchasing',
                    
                    order_id: data.razorpayId, // This is the order_id created in the backend
                    prefill: {
                        name: data.order.Address.Name,
                        email: data.email,
                        contact: data.order.Address.Mobile
                    },
                    theme: {
                        color: '#F37254'
                    },
                    "handler": function (response) {
                        fetch('/verify-payment', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        })
                        .then(res => res.json())
                        .then(data => {
                            console.log('data after completing backend verification',data)
                            if(data.success){
                                console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀')
                                window.location.href = "/placeOrder"
                            }else{
                                alert('Payment verification failed')
                            }
                        }).catch((error)=>{
                            console.log("Error: ",error.message)
                            alert('Error verifying payment')
                        })
                    }
                };
                
                const rzp = new Razorpay(options);
                rzp.open();
            }
        }
        const orderId = data.orderId;
        console.log(orderId);
        $("button").show();
    }
});





addressRadios.forEach(addressRadio => {
    console.log('radio change...for address')
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
        console.log('radio change for payment method')
        // Unselect other payment radios
        paymentRadios.forEach(radio => {
            if (radio !== paymentRadio) {
                radio.checked = false;
            }
        });
    });
});

// Function to get the selected value

