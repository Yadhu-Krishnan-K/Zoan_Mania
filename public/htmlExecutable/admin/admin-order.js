const socket = io()

function updateOrderStatus(orderId, newStatus) {
  console.log('sending request...')
  fetch(`/admin/orders/updateStatus/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newStatus }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Order status updated successfully",
          showConfirmButton: false,
          timer: 1500
        });

      } else {
          Swal.fire({
            icon: "error",
            title: "Failed to update order status",
            showClass: {
              popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
      `
            },
            hideClass: {
              popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
      `
            }
          });
      }
    })
    .catch((error) => {
      console.error('Error updating status:', error);
    });
}

socket.on('order placed',()=>{
    window.location.reload()
})