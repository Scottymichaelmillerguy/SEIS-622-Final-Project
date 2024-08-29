window.addEventListener('load', function () {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const deliveryType = localStorage.getItem('deliveryType') || 'pickup';
    cartItems = cartItems.filter(item => item.quantity > 0);

    if (firstName) {
        document.querySelector('#Salutations h1').textContent = `Hi, ${firstName} ${lastName}`;
    }


    const orderDetailsSection = document.querySelector('#OrderDetails');
    orderDetailsSection.innerHTML = '';

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

    const now = new Date();
    let futureTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    if (futureTime.getHours() >= 22) {
        futureTime.setHours(21, 0, 0, 0);
    }

    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedTime = futureTime.toLocaleTimeString([], options);

    const deliveryText = deliveryType === 'pickup' ? 'pickup' : 'delivery';
    document.querySelector('#Time p').innerHTML = `Your order will be available at this <b>${formattedTime}</b> for ${deliveryText}.`;

    document.querySelector('.home_button').addEventListener('click', resetCartQuantitiesAndRemoveItems);
    document.querySelector('.chekout_button').addEventListener('click', resetCartQuantitiesAndRemoveItems);
});

function resetCartQuantitiesAndRemoveItems() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    cartItems.forEach(item => {
        item.quantity = 0;
    });

    const updatedCartItems = cartItems.filter(item => item.quantity > 0);

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

    const orderDetailsSection = document.querySelector('#OrderDetails');
    if (orderDetailsSection) {
        if (updatedCartItems.length === 0) {
            orderDetailsSection.innerHTML = '<p>All items in your cart have been removed.</p>';
        } else {
            orderDetailsSection.innerHTML = '';
            updatedCartItems.forEach((item, index) => {
                const itemHtml = `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.description}" style="width: 50px; height: 50px;">
                        <span class="item-name">${item.description}</span>
                        <span class="quantity">Quantity: ${item.quantity}</span>
                    </div>
                `;
                orderDetailsSection.innerHTML += itemHtml;
            });
        }
    }

    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = '0';
    }
}
