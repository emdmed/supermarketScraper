
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const api_handler = require("./handlers/api_handler");


const server = require("http").createServer(app);

app.use(express.static(__dirname + "/client"));

server.listen(process.env.PORT || 3000);
console.log("Server running...")

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//ROUTES

api_handler.get_product.dia("tomates")


app.get("/", function(req, res){
    res.sendFile(__dirname + "/client/index.html");
})
