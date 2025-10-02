    // const exampleModal = document.getElementById('editModal')
    //   exampleModal.addEventListener('show.bs.modal', event => {
    //     // Button that triggered the modal
    //     const button = event.relatedTarget
    //     // Extract info from data-bs-* attributes
    //     const recipient = button.getAttribute('data-bs-whatever')
    //     // If necessary, you could initiate an AJAX request here
    //     // and then do the updating in a callback.
    
    //     // Update the modal's content.
    //     const modalTitle = exampleModal.querySelector('.modal-title')
    //     const modalBodyInput = exampleModal.querySelector('.modal-body input')
    //     })


    function openEditModal() {
        // console.log("id===",addressId)
        console.log("edit button clicked")
                $('#editModal').modal('show');
    }


    function saveDetail(){

        const name = document.getElementById('recipient-name').value
        console.log("name==",name)
        const email = document.getElementById('recipient-email').value
        console.log("email==",email)

        const phone = document.getElementById('recipient-Pnumber').value
        console.log("phone==",phone)


        const data = {
            name,email,phone
        }
        fetch('/updateInfo',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        })
        .then((res) => res.json())
        .then((data) => {
            document.getElementById('recipient-name').value = "";
        document.getElementById('recipient-email').value = "";
        document.getElementById('recipient-Pnumber').value = "";

        // Close the modal (assuming you're using Bootstrap modal)
        $('#editModal').modal('hide');
        
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your address has been updated',
            showConfirmButton: false,
            timer: 1500
        })
        setTimeout(()=>{
            location.reload();
        },1800)
        // Optionally, you can update the address list on the page.
            });
        
    }