async function getProducts() {
    try {
        const response = await fetch('http://localhost:3000/');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data to see its structure

        // Extract and combine products from each department
        if (data && Array.isArray(data.departments)) {
            const allProducts = data.departments.flatMap(department => department.products);
            return allProducts;
        } else {
            throw new Error('Unexpected data format');
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const products = await getProducts();
    console.log('Products:', products); // Log the products before rendering

    if (!Array.isArray(products)) {
        console.error('Expected an array but got:', products);
        return;
    }

    renderProducts(products);
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
            <input class="item-quantity" type="number" value="${product.quantity}">
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
