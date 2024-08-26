function calculatePayment() {
    const itemtotalElement = document.querySelector('.item-total');
    const cartItems = document.querySelectorAll('.cart-item');
    
    let total = 0;

    cartItems.forEach(cartItem => {
        const priceElement = cartItem.querySelector('.price');
        const quantityElement = cartItem.querySelector('.quantity-input');

        if (priceElement && quantityElement) {
            const priceText = priceElement.textContent.trim().replace('$', '');
            const price = parseFloat(priceText);
            const quantity = parseInt(quantityElement.value);

            // Multiply price by quantity and add to the total
            total += price * quantity;
        } else {
            console.error("Missing price or quantity element in a cart item.");
        }
    });

    // Update the item total element with the computed total amount
    if (itemtotalElement) {
        itemtotalElement.textContent = `Item Total: $${total.toFixed(2)}`;
    } else {
        console.error("itemtotalElement not found.");
    }

    // Calculate and display tax amount
    calculateTax(total);
    updateTotalAmount();
}

function calculateTax(totalAmount) {
    const taxRate = 0.03; // 3% tax rate
    const taxAmount = totalAmount * taxRate;
    const taxElement = document.querySelector('.tax-amount');

    if (taxElement) {
        taxElement.textContent = `Tax Amount (3%): $${taxAmount.toFixed(2)}`;
    } else {
        console.error("taxElement not found.");
    }
    updateTotalAmount();
}

function calculateShippingCost() {
    const deliveryTypeElement = document.querySelector('#delivery_type');
    const shippingCostElement = document.querySelector('.shipping-cost');
    let shippingCost = 0;

    if (deliveryTypeElement.value === 'shipping') {
        shippingCost = 7;
    } else if (deliveryTypeElement.value === 'pickup') {
        shippingCost = 0;
    }

    if (shippingCostElement) {
        shippingCostElement.textContent = `Shipping Costs: $${shippingCost.toFixed(2)}`;
    } else {
        console.error("shippingCostElement not found.");
    }
    updateTotalAmount();
}

function setupDeliveryTypeChangeListener() {
    const deliveryTypeElement = document.querySelector('#delivery_type');
    
    if (deliveryTypeElement) {
        deliveryTypeElement.addEventListener('change', () => {
            calculateShippingCost();
        });
    } else {
        console.error("deliveryTypeElement not found.");
    }
}

function setupQuantityChangeListeners() {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    
    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            calculatePayment(); // Recalculate the total when quantity changes
        });
    });
}

function updateTotalAmount() {
    const itemTotalElement = document.querySelector('.item-total');
    const taxAmountElement = document.querySelector('.tax-amount');
    const shippingCostElement = document.querySelector('.shipping-cost');
    const totalAmountElement = document.querySelector('.total-amount');

    // Extract numeric values from the text content
    const itemTotal = parseFloat(itemTotalElement.textContent.replace('Item Total: $', '')) || 0;
    const taxAmount = parseFloat(taxAmountElement.textContent.replace('Tax Amount: $', '')) || 0;
    const shippingCost = parseFloat(shippingCostElement.textContent.replace('Shipping Costs: $', '')) || 0;

    // Calculate the total amount
    const totalAmount = itemTotal + taxAmount + shippingCost;

    // Update the total amount element
    if (totalAmountElement) {
        totalAmountElement.textContent = `Total Payment Amount: $${totalAmount.toFixed(2)}`;
    } else {
        console.error("totalAmountElement not found.");
    }
}



document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('farmerssquare_checkout.html')) {
        calculatePayment();
        setupQuantityChangeListeners(); // Set up listeners after items are loaded
        setupDeliveryTypeChangeListener();
    }
});


document.querySelector('.payment-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Capture form data
    const firstName = document.querySelector('input[placeholder="First Name"]').value.trim();
    const lastName = document.querySelector('input[placeholder="Last Name"]').value.trim();
    const email = document.querySelector('input[placeholder="Email Address"]').value.trim();
    const streetAddress = document.querySelector('input[placeholder="Street Address"]').value.trim();
    const phoneNumber = document.querySelector('input[placeholder="Phone Number"]').value.trim();
    const ccNumber = document.querySelector('input[placeholder="Credit Card Number"]').value.trim();
    const expDate = document.querySelector('input[placeholder="Exp. Date"]').value.trim();
    const cvv = document.querySelector('input[placeholder="CVV"]').value.trim();
    const billingAddress = document.querySelector('input[placeholder="Billing Address"]').value.trim();

    // Check if any of the required fields are empty
    if (!firstName || !lastName || !email || !streetAddress || !phoneNumber || !ccNumber || !expDate || !cvv || !billingAddress) {
        alert('Please complete all required contact and billing information before proceeding to payment.');
        return; // Stop execution if any field is empty
    }

    // Store the data in localStorage
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('email', email);
    localStorage.setItem('streetAddress', streetAddress);
    localStorage.setItem('phoneNumber', phoneNumber);
    localStorage.setItem('ccNumber', ccNumber);
    localStorage.setItem('expDate', expDate);
    localStorage.setItem('cvv', cvv);
    localStorage.setItem('billingAddress', billingAddress);

    // Redirect to the order completion page
    window.location.href = 'farmerssquare_ordercomplete.html';
});
