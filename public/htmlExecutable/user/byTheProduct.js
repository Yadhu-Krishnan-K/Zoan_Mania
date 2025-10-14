//onloading

function disap(productId, Stock) {
    const incElement = document.getElementById('incBtn_' + productId)
    const decElement = document.getElementById('decBtn_' + productId)
    const val = document.getElementById('quantity_' + productId).value
    console.log()
    if (val == 1) {
        decElement.disabled = true
    } else if (val == Stock) {
        incElement.disabled = true
    }
    else {
        decElement.disabled = false
        incElement.disabled = false

    }
}















var qid = document.getElementById('')
function updateQuandity(productId, number, Stock) {
    const quantity = document.getElementById('quantity_' + productId).textContent
    console.log("quantity=====", quantity)
    var inc = number
    if (quantity == 1 && number == -1) { inc = 0 }
    if (quantity == Stock && number == 1) { inc = 0 }
    console.log("number====", inc)
    $.ajax({
        url: '/updateCartValue',
        method: 'POST',
        data: {
            productId,
            inc
        },
        success: (Response) => {
            console.log("response to front end======", Response.Quantity);
            document.getElementById('quantity_' + productId).innerHTML = Response.Quantity
            if (Response.Quantity < Response.Stock && Response.Quantity > 1) {

                document.getElementById('decBtn_' + productId).disabled = false
                document.getElementById('incBtn_' + productId).disabled = false


            } else if (Response.Quantity <= 1) {
                document.getElementById('decBtn_' + productId).disabled = true
            } else if (Response.Quantity >= Response.Stock) {
                document.getElementById('incBtn_' + productId).disabled = true
            }

            document.getElementById('totalPrice').innerHTML = "Total Price= ₹" + Response.totalPrice + "/-"

            document.getElementById('price' + productId).innerHTML = "₹" + Response.price + "/-"
            document.getElementById(`totalCartQuantity`).innerHTML = Response.totalQuantity

        }
    })

}


function deleteItem(cartId, name, ParentId) {
    alert('Do yo want to remove this item')
    $.ajax({
        url: `/deleteCartItem/${cartId}`,
        method: 'PUT',
        data: {
            ParentId
        },
        success: (Response) => {
            location.reload()
        }
    })
}