const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;
const filePath = path.join(__dirname, "items.json");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

const cors = require("cors");
app.use(cors({ origin: ['http://localhost:5500'] }));

import {IProduct } from './Iproducts.js';


// Initialize itemList
let itemList: IProduct[] = [];

// Read items from JSON file
fs.readFile(filePath, (err: any, data: any) => {
    if (err) {
        console.error("Unable to read file: " + filePath);
    } else {
        itemList = JSON.parse(data);
    }
});

// Serve itemList at root endpoint
app.get("/", (req, res) => {
    res.status(200).json(itemList);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
