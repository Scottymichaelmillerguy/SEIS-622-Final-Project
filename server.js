"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var fs = require("fs");
var app = express();
var port = 3000;
var filePath = path.join(__dirname, "items.json");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
var cors = require("cors");
app.use(cors({ origin: ['http://127.0.0.1:5500'] }));
// Initialize itemList
var itemList = [];
// Read items from JSON file
fs.readFile(filePath, function (err, data) {
    if (err) {
        console.error("Unable to read file: " + filePath);
    }
    else {
        itemList = JSON.parse(data);
    }
});


// Serve itemList at root endpoint
app.get("/", function (req, res) {
    res.status(200).json(itemList);
});
// Start the server
app.listen(port, function () {
    console.log("Server is listening on port ".concat(port));
});
