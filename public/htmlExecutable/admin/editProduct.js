function deletePic(P_id, num) {
    fetch(`/admin/deleteImage/${P_id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            num: num,
        })
    })
        .then(res => res.json())
        .then((data) => {
            // console.log(data);
            if (data.success) {
                location.reload();
            }

        })
}


function Clicked() {
    document.getElementById('sub').addEventListener("submit", (e) => {
        let stock = document.getElementById('stock').value;
        let price = document.getElementById('price').value;
        let err = document.getElementById('stocker');
        let prerr = document.getElementById('priceErr');
        if (stock < 0) {
            e.preventDefault();
            err.style.display = 'block'
            err.innerHTML = 'stock should be greater than or equal to 0';
            setTimeout(() => {
                err.style.display = 'none'
            }, 4000)
        }
        if (price <= 0) {
            e.preventDefault();
            prerr.style.display = 'block'
            prerr.innerHTML = 'price should be greater than 0';
            setTimeout(() => {
                prerr.style.display = 'none'
            }, 4000)
        }
    })
}
function Cimg(ev) {
    document.getElementById('mainImage').src = URL.createObjectURL(ev.target.files[0]);
    document.getElementById('DmainImage').style.display = 'none'
    document.getElementById('mainImage').style.display = 'block';
}
function C2img(ev) {
    document.getElementById('image1').src = URL.createObjectURL(ev.target.files[0]);
    document.getElementById('Dimage1').style.display = 'none'
    document.getElementById('image1').style.display = 'block';
}
function C3img(ev) {
    document.getElementById('image2').src = URL.createObjectURL(ev.target.files[0]);
    document.getElementById('Dimage2').style.display = 'none'
    document.getElementById('image2').style.display = 'block';
}
function C4img(ev) {
    document.getElementById('image3').src = URL.createObjectURL(ev.target.files[0]);
    document.getElementById('Dimage3').style.display = 'none'
    document.getElementById('image3').style.display = 'block';
}