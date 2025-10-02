
const saveAddress = async () => {
    const Name = document.getElementById('recipient-name').value
    const Address = document.getElementById('recipient-address').value
    const City = document.getElementById('recipient-City').value
    const Pincode = document.getElementById('recipient-Pincode').value
    const State = document.getElementById('recipient-State').value
    const Mobile = document.getElementById('recipient-Mobile').value

    console.log("Name=", Name,
        "AddressLine=", Address,
        "City=", City,
        "Pincode=", Pincode,
        "State=", State,
        "Mobile=", Mobile)

    const res = await fetch('/saveAddress', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Name, Address, City, Pincode, State, Mobile
        })
    })
    const data = await res.json()
    // console.log(data)
    if (data.success) {
        // Address saved successfully
        // Display a success message

        // Clear form fields (optional)
        document.getElementById('recipient-name').value = "";
        document.getElementById('recipient-address').value = "";
        document.getElementById('recipient-City').value = "";
        document.getElementById('recipient-Pincode').value = "";
        document.getElementById('recipient-State').value = "";
        document.getElementById('recipient-Mobile').value = "";

        // Close the modal (assuming you're using Bootstrap modal)
        $('#exampleModal').modal('hide');

        // Optionally, you can update the address list on the page.
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your address has been saved',
            showConfirmButton: false,
            timer: 1500
        })
        setTimeout(() => {
            location.reload();
        }, 1800)

    }


}

//dfkjaj lkdjfsj flkjlkdsj

function openEditAddressModal(addressId) {
    console.log("id===", addressId)
    console.log("edit button clicked")
    $('#EditAddressModal' + addressId).modal('show');
}






const updateAddress = async (addressId, userId) => {
    console.log("address Id from console===", addressId)
    const Name = document.getElementById('reci-name').value
    const Address = document.getElementById('reci-address').value
    const City = document.getElementById('reci-City').value
    const Pincode = document.getElementById('reci-Pincode').value
    const State = document.getElementById('reci-State').value
    const Mobile = document.getElementById('reci-Mobile').value

    const res = await fetch(`/updateAddress/${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            addressId, Name, Address, City, Pincode, State, Mobile
        })
    })
    const data = await res.json()
    if (data.success) {
        // Address saved successfully
        // Display a success message

        // Clear form fields (optional)
        document.getElementById('recipient-name').value = "";
        document.getElementById('recipient-address').value = "";
        document.getElementById('recipient-City').value = "";
        document.getElementById('recipient-Pincode').value = "";
        document.getElementById('recipient-State').value = "";
        document.getElementById('recipient-Mobile').value = "";

        // Close the modal (assuming you're using Bootstrap modal)
        $('#exampleModal').modal('hide');

        // Optionally, you can update the address list on the page.
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your address has been updated',
            showConfirmButton: false,
            timer: 1500
        })
        setTimeout(() => {
            location.reload();
        }, 1800)

    }

}
