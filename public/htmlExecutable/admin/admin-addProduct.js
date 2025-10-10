function handleImageInput(index) {
    const fileInput = document.getElementById(`image${index}`);
    const file = fileInput.files[0];
    const allowedExtensions = ['jpg', 'jpeg', 'png'];

    if (!file) return; // nothing selected

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        showError('Invalid file type. Please upload only JPG, JPEG, or PNG.');
        resetInput(fileInput);
        return;
    }

    // show preview
    const preview = document.getElementById(`image-preview-${index}`);
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = "inline-block";
    };
    reader.readAsDataURL(file);

    // create next input if less than 4
    if (index < 4 && !document.getElementById(`image${index + 1}`)) {
        const container = document.getElementById("image-inputs");
        const newInput = document.createElement("input");
        newInput.type = "file";
        newInput.name = "images";
        newInput.id = `image${index + 1}`;
        newInput.accept = "image/*";
        newInput.required = true;
        newInput.classList.add("mt-2");
        newInput.onchange = () => handleImageInput(index + 1);
        container.appendChild(newInput);
        container.appendChild(document.createElement("br"));
    } else if (index === 4) {
        showError('Maximum 4 images allowed');
    }
}

// show error helper
function showError(message) {
    const doc = document.getElementById('doc');
    doc.innerHTML = message;
    doc.style.display = 'block';
    setTimeout(() => doc.style.display = 'none', 3000);
}

// reset invalid input
function resetInput(input) {
    const newInput = input.cloneNode(true);
    newInput.value = '';
    newInput.onchange = input.onchange;
    input.parentNode.replaceChild(newInput, input);
}

// form validation
document.getElementById('sub').addEventListener("submit", (e) => {
    const stock = document.getElementById('stock').value;
    const price = document.getElementById('price').value;
    const err = document.getElementById('stocker');
    const prerr = document.getElementById('priceErr');
    const cat = document.getElementById('category').value;
    const caterr = document.getElementById('caterr');

    if (stock < 0) {
        e.preventDefault();
        err.style.display = 'block';
        err.innerHTML = 'Stock should be greater than or equal to 0';
        setTimeout(() => err.style.display = 'none', 4000);
    }
    if (price <= 0) {
        e.preventDefault();
        prerr.style.display = 'block';
        prerr.innerHTML = 'Price should be greater than 0';
        setTimeout(() => prerr.style.display = 'none', 4000);
    }
    if (cat === '') {
        e.preventDefault();
        caterr.style.display = 'block';
        caterr.innerHTML = 'Select a category';
        setTimeout(() => caterr.style.display = 'none', 4000);
    }
});
