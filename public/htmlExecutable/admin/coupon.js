let modalbutton = document.getElementById('addButton');

let isEdit = false
let editingId = null

let modalTitle = document.querySelector('.modal-title');
const saveBtn = document.querySelector("#form button[type='submit']");


const coupon = document.getElementById('coupon');
const minOrderAmount = document.getElementById('minOrderAmount');
const discountType = document.getElementById('discountType');
const discountValue = document.getElementById('value');
const expiryDate = document.getElementById('expiryDate');
const isActiveCoupon = document.getElementById('isActive');
let form = document.getElementById('form');

window.addEventListener('load',()=>{
    var today = new Date();
    var tomorrow = new Date(today);

    tomorrow.setDate(today.getDate()+1);

    var dd = String(tomorrow.getDate()).padStart(2, '0');
    var mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); // January is 0!
    var yyyy = tomorrow.getFullYear();

    tomorrow = yyyy + '-' + mm + '-' + dd;
    document.getElementById('expiryDate').setAttribute('min', tomorrow);
})

form.addEventListener('submit',async(event)=>{
    event.preventDefault()
    
    let dataCoupon = coupon.value
    let dataAmount = minOrderAmount.value
    let dataDiscountType = discountType.value
    let dataDiscountValue = discountValue.value
    let dataExpiryDate = expiryDate.value
    let dataIsActiveCoupon = isActiveCoupon.checked;

    const data = {
        editingId,
        dataCoupon,
        dataAmount,
        dataDiscountType,
        dataDiscountValue,
        dataExpiryDate,
        dataIsActiveCoupon
    }
    let method = null;

    isEdit?method='PUT':method='POST'
   
    let response = await fetch('/admin/Coupons',{
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    let responseData = await response.json()
    console.log('response = ',responseData)
    if(responseData.success){
        alert("new coupon created")
        window.location.reload()
    }
    if(isEdit){
        isEdit = false;
        editingId = null;

        modalTitle.innerText = "Add New Coupon";
        saveBtn.innerText = "Save Coupon";

        form.reset();
    }
})


document.querySelectorAll('.editBtn').forEach(btn=>{
    btn.addEventListener('click',()=>{
        isEdit = true;
        editingId = btn.dataset.id;
        console.log('editingid = ',editingId)
        modalTitle.innerText = "Edit Coupon";
        saveBtn.innerText = "Update Coupon";

        // Pre-fill fields
        document.getElementById("coupon").value = btn.dataset.code;
        document.getElementById("minOrderAmount").value = btn.dataset.minOrderAmount
        document.getElementById("discountType").value = btn.dataset.type;
        document.getElementById("value").value = btn.dataset.discount;
        document.getElementById("expiryDate").value = formatDate(btn.dataset.expiry);
        console.log('expiry = ',btn.dataset.expiry)
        document.getElementById("isActive").checked = btn.dataset.active === "true";
        console.log('isActive = ',btn.dataset.active)
    })
})


const formatDate =(input)=>{
// const date = new Date(input);

// // Convert to mm-dd-yyyy
// const mm = String(date.getMonth() + 1).padStart(2, "0");
// const dd = String(date.getDate()).padStart(2, "0");
// const yyyy = date.getFullYear();

// const formatted = `${mm}-${dd}-${yyyy}`;

// console.log(formatted);  // 👉 11-15-2025
// return formatted;

const date = new Date(input);

// Convert to ISO format (YYYY-MM-DD)
const iso = date.toISOString().split("T")[0];
console.log('iso = ',iso)
return iso

}



document.querySelectorAll('.deleteBtn').forEach((btn)=>{
    btn.addEventListener('click',async()=>{
        let deleteId = btn.dataset.id
        console.log('deleteId = ',deleteId)
        alert('Do you want to delete this')
        const response = await fetch(`/admin/coupons/${deleteId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
        });
        let data = await response.json()
        if(data.success){
            window.location.reload()
        }
    })
})