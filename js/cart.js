let itemCount = 0;

function updateCartCount() {
    const cartIcon = document.querySelector('.chekout_button img');
    let count = 0;
    const cartItems = [];

    const quantityInputs = document.querySelectorAll('.item-quantity');
    quantityInputs.forEach(input => {
        const quantity = Number(input.value);
        if (quantity > 0) {
            count += 1;
            const productRow = input.closest('td');
            const product = {
                image: productRow.querySelector('img').src,
                description: productRow.querySelector('.description').textContent,
                price: productRow.querySelector('.price').textContent,
                quantity: quantity
            };
            cartItems.push(product);
        }
    });

    itemCount = count;

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
    countElement.textContent = itemCount;

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function attachQuantityChangeListeners() {
    const quantityInputs = document.querySelectorAll('.item-quantity');
    quantityInputs.forEach(input => {
        input.addEventListener('input', handleQuantityChange);
    });
}

function handleQuantityChange(event) {
    const value = Number(event.target.value);

    if (value > 0) {
        updateCartCount();
    } else {
        updateCartCount();
    }
}


document.addEventListener('click', (event) => {
    if (event.target.matches('.item-quantity')) {
        attachQuantityChangeListeners();
        updateCartCount();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('farmerssquare_checkout.html')) {
        loadCheckoutItems();
        attachDeleteButtonListener();
    }
});

function loadCheckoutItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    const cartContainer = document.querySelector('.cart-item-container');
    cartContainer.innerHTML = ''; 

    const nonZeroItems = cartItems.filter(item => item.quantity > 0);

    nonZeroItems.forEach((item, index) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <input type="checkbox" class="delete-checkbox" data-index="${index}">
            <label><img src="${item.image}" alt="${item.description}" style="width: 50px; height: 50px;"></label>
            <span class="item-name">${item.description}</span>
            <span class="quantity-labelr">Quantity:</span>
            <input type="number" class="quantity-input" min="1" value="${item.quantity}">
            <span class="price">${item.price}</span>
        `;
        cartContainer.appendChild(cartItemDiv);
    });

    calculatePayment();
}


function attachDeleteButtonListener() {
    const deleteButton = document.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.delete-checkbox');
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                cartItems[index].quantity = 0;
            }
        });

        const updatedCartItems = cartItems.filter(item => item.quantity > 0);

        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

        reloadCartItems();
    });
}

function reloadCartItems() {
    const cartContainer = document.querySelector('.cart-item-container');
    cartContainer.innerHTML = ''; 

    const updatedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    
    const nonZeroItems = updatedCartItems.filter(item => item.quantity > 0);

    nonZeroItems.forEach((item, index) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <input type="checkbox" class="delete-checkbox" data-index="${index}">
            <label><img src="${item.image}" alt="${item.description}" style="width: 50px; height: 50px;"></label>
            <span class="item-name">${item.description}</span>
            <span class="quantity-label">Quantity:</span>
            <input type="number" class="quantity-input" min="1" value="${item.quantity}">
            <span class="price">${item.price}</span>
        `;
        cartContainer.appendChild(cartItemDiv);
    });

    calculatePayment();
    loadCheckoutItems();
}


document.querySelector('#SameAddress').addEventListener('change', function() {
    const streetAddress = document.querySelector('input[placeholder="Street Address"]').value;
    const billingAddressInput = document.querySelector('input[placeholder="Billing Address"]');
    
    if (this.checked) {
        billingAddressInput.value = streetAddress; 
        billingAddressInput.disabled = true; 
    } else {
        billingAddressInput.value = ''; 
        billingAddressInput.disabled = false; 
    }
});

document.querySelector('#delivery_type').addEventListener('change', function() {
    const deliveryType = this.value;
    localStorage.setItem('deliveryType', deliveryType);
});
