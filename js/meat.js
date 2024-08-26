async function getDepartmentProducts(n) {
    try {
        const response = await fetch('http://localhost:3000/');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data to see its structure
        
        //console.log(`${JSON.stringify(data.departments[0].products)}`);

        console.log(`${data.departments}`);
        // Extract and combine products from each department
        if (data && Array.isArray(data.departments)) {
            const Products = data.departments[1].products;
            return Products;
        } else {
            throw new Error('Unexpected data format');
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}

getDepartmentProducts();


document.addEventListener('DOMContentLoaded', async () => {
    const products = await getDepartmentProducts();
    console.log('Products:', products); // Log the products before rendering

    if (!Array.isArray(products)) {
        console.error('Expected an array but got:', products);
        return;
    }

    renderProducts(products);
    attachQuantityChangeListeners(); // Ensure listeners are attached after rendering

    // Update itemCount and display on cart icon
    updateItemCount(cartItems.length);
});



function createProductRow(product) {
    console.log('Product:', product); // Log the product to see its properties and types
    
    // Ensure price is a number before calling toFixed
    const price = typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A';

    return `
        <td>
            <img class="department-img" src="${product.image}" alt="${product.description}">
            <p class="description">${product.description}</p>
            <p class="price">$${price}</p>
            <input class="item-quantity" type="number" min="0" value="${product.quantity}">
        </td>
    `;
}



function renderProducts(products) {
    console.log('Rendering products:', products); // Log the products before rendering
    const tableContainer = document.querySelector('.table-container table');
    if (!tableContainer) {
        console.error('Table container not found');
        return;
    }

    let rows = '';
    products.forEach((product, index) => {
        if (index % 3 === 0) {
            if (index > 0) rows += '</tr>';
            rows += '<tr>';
        }
        rows += createProductRow(product);
    });
    rows += '</tr>';

    console.log('Rows to be inserted:', rows); // Log the generated HTML rows
    tableContainer.innerHTML = rows;
}
function attachQuantityChangeListeners() {
    const quantityInputs = document.querySelectorAll('.item-quantity');
    quantityInputs.forEach(input => {
        input.addEventListener('input', handleQuantityChange);
    });
}

function handleQuantityChange(event) {
    const input = event.target;
    const productRow = input.closest('td');
    const description = productRow.querySelector('.description').textContent;
    const quantity = Number(input.value);

    // Update the local storage with the new quantity
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = cartItems.findIndex(item => item.description === description);

    if (itemIndex >= 0) {
        if (quantity > 0) {
            cartItems[itemIndex].quantity = quantity;
        } else {
            cartItems.splice(itemIndex, 1); // Remove item if quantity is 0
        }
    } else if (quantity > 0) {
        const newItem = {
            image: productRow.querySelector('img').src,
            description: description,
            price: productRow.querySelector('.price').textContent,
            quantity: quantity
        };
        cartItems.push(newItem);
    }

    // Save updated cartItems to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Update itemCount and display on cart icon
    updateItemCount(cartItems.length);
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