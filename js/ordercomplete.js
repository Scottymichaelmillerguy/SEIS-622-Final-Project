window.addEventListener('load', function() {
    // Retrieve stored data from localStorage
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const deliveryType = localStorage.getItem('deliveryType') || 'pickup'; // Default to 'pickup' if not set

    // Populate the order completion page with user information
    if (firstName) {
        document.querySelector('#Salutations h1').textContent = `Hi, ${firstName} ${lastName}`;
    }

    // Populate grocery items under Order Details
    const orderDetailsSection = document.querySelector('#OrderDetails');
    orderDetailsSection.innerHTML = ''; // Clear any existing content

    if (cartItems.length > 0) {
        cartItems.forEach((item, index) => {
            const itemHtml = `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.description}" style="width: 50px; height: 50px;">
                    <span class="item-name">${item.description}</span>
                    <span class="quantity">Quantity: ${item.quantity}</span>
                </div>
            `;
            orderDetailsSection.innerHTML += itemHtml;
        });
    } else {
        orderDetailsSection.innerHTML = '<p>No items in your cart.</p>';
    }

    // Calculate the time 7 hours from now
    const now = new Date();
    let futureTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 7 hours from now

    // Check if the calculated future time is past 10 PM
    if (futureTime.getHours() >= 22) {
        futureTime.setHours(21, 0, 0, 0); // Set to 9:00 PM
    }

    // Format the time in a user-friendly way
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedTime = futureTime.toLocaleTimeString([], options);

    const deliveryText = deliveryType === 'pickup' ? 'pickup' : 'delivery';
    document.querySelector('#Time p').innerHTML = `Your order will be available at this <b>${formattedTime}</b> for ${deliveryText}.`;

    // Attach event listeners to set cart items quantity to 0 on Home and Cart button clicks
    document.querySelector('.home_button').addEventListener('click', resetCartQuantities);
    document.querySelector('.chekout_button').addEventListener('click', resetCartQuantities);
});

function resetCartQuantities() {
    // Retrieve the cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Set the quantity of each item to 0
    cartItems.forEach(item => {
        item.quantity = 0;
    });

    // Save updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Reload the cart items on the page, filtering out items with quantity 0
    reloadCartItems();

    // Optionally, update the UI to reflect that all quantities are 0 on the order completion page
    const orderDetailsSection = document.querySelector('#OrderDetails');
    if (orderDetailsSection) {
        orderDetailsSection.innerHTML = '<p>All items in your cart have been set to 0 quantity.</p>';
    }

    // Update the cart count display if applicable
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = '0';
    }
}

