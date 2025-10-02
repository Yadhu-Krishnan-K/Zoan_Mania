function cancelOrder(orderId) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Cancel it!"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/cancelOrderData/${orderId}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        Swal.fire({
                            title: "Order Canceled!",
                            text: "Your order has been canceled.",
                            icon: "success"
                        })
                            .then(
                                setTimeout(() => {
                                    location.reload()
                                }, 3000)
                            );
                    }
                })
                .catch((err) => console.log(err))
        }
    });
}
