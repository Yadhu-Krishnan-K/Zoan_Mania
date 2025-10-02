function limNpre() {
    const selectedFiles = document.getElementById('image1').files;
    console.log("selectedFiles====", selectedFiles)
    const allowedExtensions = ['jpg', 'jpeg', 'png'];

    if (selectedFiles.length > 4) {
        document.getElementById('doc').innerHTML = 'Maximum 4 images allowed';
        document.getElementById('doc').style.display = 'block';
        setTimeout(() => {
            document.getElementById('doc').style.display = 'none';
            const newInput = replaceFileInput();
            newInput.addEventListener('change', limNpre);
        }, 3000);
        return;
    }

    const imgPreviewContainer = document.querySelector('.img-preview-container');
    imgPreviewContainer.innerHTML = '';

    for (let i = 0; i < selectedFiles.length && i < 4; i++) {

        const fileExtension = selectedFiles[i].name.split('.').pop().toLowerCase();
        console.log('file extension====', fileExtension)

        if (allowedExtensions.includes(fileExtension)) {
            const imgPreview = document.getElementById(`image-preview-${i + 1}`);
            if (imgPreview) {
                const reader = new FileReader();
                reader.readAsDataURL(selectedFiles[i]);
                reader.onload = function (e) {
                    imgPreview.src = e.target.result;
                };
            }
        } else {
            document.getElementById('doc').innerHTML = 'Invalid file type. Please upload only images';
            document.getElementById('doc').style.display = 'block';
            setTimeout(() => {
                document.getElementById('doc').style.display = 'none';
                const newInput = replaceFileInput();
                newInput.addEventListener('change', limNpre);
            }, 3000);
            return;
        }
    }

}

function replaceFileInput() {
    const oldInput = document.getElementById('image1');
    const newInput = document.createElement('input');

    newInput.type = 'file';
    newInput.name = oldInput.name;
    newInput.id = oldInput.id;
    newInput.accept = oldInput.accept;
    newInput.multiple = oldInput.multiple;
    newInput.required = oldInput.required;

    oldInput.parentNode.replaceChild(newInput, oldInput);

    return newInput;
}


document.getElementById('sub').addEventListener("submit", (e) => {
    let stock = document.getElementById('stock').value;
    let price = document.getElementById('price').value;
    let err = document.getElementById('stocker');
    let prerr = document.getElementById('priceErr');
    let cat = document.getElementById('category').textContent;
    let caterr = document.getElementById('caterr');
    if (stock < 0) {
        e.preventDefault();
        err.style.display = 'block';
        err.innerHTML = 'stock should be greater than or equal to 0';
        setTimeout(() => {
            err.style.display = 'none';
        }, 4000);
    }
    if (price <= 0) {
        e.preventDefault();
        prerr.style.display = 'block';
        prerr.innerHTML = 'price should be greater than 0';
        setTimeout(() => {
            prerr.style.display = 'none';
        }, 4000);
    }
    if (cat === 'Select a category') {
        e.preventDefault();
        caterr.style.display = 'block';
        caterr.innerHTML = 'Select a category';
        setTimeout(() => {
            caterr.style.display = 'none';
        }, 4000);
    }
});