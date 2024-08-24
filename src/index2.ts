const express = require("express");
const port = 3000;

const app = express();
const path = require("path");
const fs = require("fs");

const filePath = path.join(__dirname, "items.json");

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());

const cors = require("cors");

let corsOptions = {
    origin: ['http://localhost:5500']
}
app.use(cors());

import { IStore } from './Iproducts';

import { IDepartment } from './Iproducts';

import { IProduct } from './Iproducts';


let itemList: IProduct[] = [];

fs.readFile(filePath, (err: any, data: any) => {
    if (err) {
        console.error("Unable to read file: " + filePath);
    } else {
        itemList = JSON.parse(data)
    }
});

app.get("/", (req, resp) => {    
    resp.status(200);
    return resp.json(itemList);       
});


app.listen(port, () => {
    console.log(`Example express file server listening on port ${port}`);
});

async function getItems(): Promise<IProduct[]> {
    try {
        const response = await fetch('http://localhost:3000/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const items: IProduct[] = await response.json();
        return items;
    } catch (error) {
        console.error('Failed to fetch items:', error);
        return [];
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', async () => {
        const items = await getItems();

        const tableContainer = document.querySelector<HTMLTableElement>('.table-container table');
        if (tableContainer) {
            tableContainer.innerHTML = ''; // Clear any existing rows

            items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <img class="department-img" src="${item.image}" alt="${item.description}">
                        <p class="description">${item.description}</p>
                        <p class="price">$${item.price.toFixed(2)}</p>
                        <input class="item-quantity" type="number" value="${item.quantity}">
                    </td>
                `;
                tableContainer.appendChild(row);
            });
        }
    });
}

