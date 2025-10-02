function updateOrderStatus(orderId, newStatus) {
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
                  alert('Order status updated successfully!');
                } else {
                  alert('Failed to update order status.');
                }
          })
          .catch((error) => {
            console.error('Error updating status:', error);
          });
      }