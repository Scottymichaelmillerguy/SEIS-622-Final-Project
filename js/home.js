async function fetchItems() {
    try {
        const response = await fetch('http://localhost:3000/');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('Fetched data:', data);

        // Extract products from the Bakery department
        if (data && Array.isArray(data.departments)) {
            const allProducts = data.departments.flatMap(department => department.products);
            console.log(`${JSON.stringify({allProducts})}`)
            return allProducts;
        } else {
            throw new Error('Unexpected data format');
        } // Return products

    } catch (error) {
        console.error('Error fetching items:', error);
        return []; // Return empty array if error occurs
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const products = await fetchItems();
    console.log('Products:', products); // Log the products before rendering

    if (!Array.isArray(products)) {
        console.error('Expected an array but got:', products);
        return;
    }

});

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
showSlides(slideIndex = n);
}

function showSlides(n) {
let i;
let slides = document.getElementsByClassName("mySlides");
let dots = document.getElementsByClassName("dot");
if (n > slides.length) {slideIndex = 1}
if (n < 1) {slideIndex = slides.length}
for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
}
for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
}
slides[slideIndex-1].style.display = "block";
dots[slideIndex-1].className += " active";
}
