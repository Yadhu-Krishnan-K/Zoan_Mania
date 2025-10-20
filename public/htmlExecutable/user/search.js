let searchInp = document.getElementById('search')
let productsTemplate = document.querySelector("[data-products]")
let products
console.log('working file search.js')
fetch('/search').then(res => res.json()).then(data=>{
    let arr = data.products.map((val,index)=>{
        return {
            ...val,
            Name: val.Name.toLowerCase()
        }
    })
    products = arr
})

searchInp.addEventListener('input',async(e)=>{
    console.log(e.target.value)
    let filteredProducts = []
    let text = e.target.value.toLowerCase();
    if (!text.trim()) {
        productsTemplate.innerHTML = "";
        return;
    }
    filteredProducts = products.filter(p => p.Name.includes(text))
    console.log('filtered = ',filteredProducts)
    showSearchResults(filteredProducts);

})


function showSearchResults(filtered){
    productsTemplate.innerHTML = "";
    if(filtered.length === 0){
        productsTemplate.innerHTML = `<li>No results found</li>`;
        return;
    }

    filtered.forEach(prod => {
        const li = document.createElement('li');
        li.classList.add('search-item', 'd-flex', 'align-items-center', 'p-2');

         // Create product image
        const img = document.createElement('img');
        img.src = `/uploads/${prod.Image[0]}` ;
        img.alt = prod.Name;
        img.style.width = '40px';
        img.style.height = '40px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '6px';
        img.style.marginRight = '10px';
        console.log('img.src = ',img.src)

        const name = document.createElement('span');
        name.textContent = prod.Name;

        li.appendChild(img);
        li.appendChild(name);

        li.addEventListener('click', () => {
            window.location.href = `/productDetail/${prod._id}`;
        });

        productsTemplate.appendChild(li);
    })
}

