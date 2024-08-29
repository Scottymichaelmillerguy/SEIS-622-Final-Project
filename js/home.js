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
        console.error(error);
        return []; // Return empty array if error occurs
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const products = await fetchItems();
        console.log('Products:', products); // Log the products before rendering

        if (!Array.isArray(products)) {
            console.error('Expected an array but got:', products);
            return;
        }

        const addToCartButton = document.querySelector('.add-to-cart-button');

        addToCartButton.addEventListener('click', () => {
            addCurrentSlideToCart();
        });

         // Load existing cart items from localStorage
         let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

         // Calculate the total quantity of items in the cart
         const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
 
         // Update the cart icon with the total item count
         updateItemCount(totalItemCount);
    } catch (error) {
        console.error('Error initializing the page:', error);
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

function addCurrentSlideToCart() {
    // Ensure slideIndex is defined and within bounds
    if (typeof slideIndex === 'undefined' || slideIndex < 1) {
        console.error('slideIndex is not defined or out of bounds.');
        return;
    }

    let slides = document.getElementsByClassName("mySlides");
    if (slideIndex - 1 >= slides.length) {
        console.error('slideIndex is out of range.');
        return;
    }

    let currentSlide = slides[slideIndex - 1];
    if (!currentSlide) {
        console.error('No slide found at this index:', slideIndex - 1);
        return;
    }

    // Get the description from the .text div
    let descriptionElement = currentSlide.querySelector('.text');
    if (!descriptionElement) {
        console.error('No element with class "text" found in the current slide.');
        return;
    }
    let description = descriptionElement.textContent.trim();

    // Get the price from the .promotion div
    let promotionElement = currentSlide.querySelector('.promotion');
    if (!promotionElement) {
        console.error('No element with class "promotion" found in the current slide.');
        return;
    }
    let promotionText = promotionElement.textContent;
    let priceMatch = promotionText.match(/\$[0-9.]+/);
    if (!priceMatch) {
        console.error('No price found in the promotion text:', promotionText);
        return;
    }
    let price = priceMatch[0];

    // Get the image source
    let imageElement = currentSlide.querySelector('img.slideshow_image');
    if (!imageElement) {
        console.error('No image with class "slideshow_image" found in the current slide.');
        return;
    }
    let imageSrc = imageElement.src;

    console.log(`Description: ${description}`);
    console.log(`Price: ${price}`);
    console.log(`Image Source: ${imageSrc}`);

    // Load existing cart items from local storage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check if the item is already in the cart
    const itemIndex = cartItems.findIndex(item => item.description === description);

    if (itemIndex >= 0) {
        // If the item is already in the cart, increase the quantity
        cartItems[itemIndex].quantity += 1;
    } else {
        // Otherwise, add the new item to the cart with quantity 1
        const newItem = {
            image: imageSrc,
            description: description,
            price: price,
            quantity: 1
        };
        cartItems.push(newItem);
    }

    // Save the updated cart back to local storage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Update the cart icon or other UI elements if necessary
    updateItemCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    
    console.log('Added to cart:', description);
}


function updateItemCount(count) {
    const cartIcon = document.querySelector('.chekout_button img');

    let countElement = document.querySelector('.cart-count');
    if (!countElement) {
        countElement = document.createElement('div');
        countElement.className = 'cart-count';
        countElement.style.position = 'absolute';
        countElement.style.top = '10px';
        countElement.style.right = '10px';
        countElement.style.backgroundColor = 'red';
        countElement.style.color = 'white';
        countElement.style.borderRadius = '50%';
        countElement.style.padding = '5px';
        countElement.style.fontSize = '12px';
        cartIcon.parentElement.appendChild(countElement);
    }
    countElement.textContent = count;
}



