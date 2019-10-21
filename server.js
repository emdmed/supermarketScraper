
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


app.post("/products_dia", async function(req, res){

    let product = req.body.product;
    let dia;

    try{
        dia = await api_handler.dia.get_products(product);
        await dia;
        //console.log(dia);
        res.status(200).send(dia).end();
    }catch(err){
        console.log(err);
        res.status(404).end();
    }
    

})


app.post("/products_coto", async function(req, res){

    let product = req.body.product;
    let coto;

    try{
        coto = await api_handler.coto.get_products(product);
        await coto;
        res.status(200).send(coto).end();
    }catch(err){
        console.log(err);
        res.status(404).end();
    }
    

})


app.post("/products_disco", async function(req, res){

    let product = req.body.product;
    let disco;

    try{
        disco = await api_handler.disco.get_products(product);
        await disco;

        if(disco === "timeout"){
            res.status(200).send("timeout").end();
        }

        //console.log(disco);
        res.status(200).send(disco).end();
    }catch(err){
        //console.log(err);
        res.status(404).end();
    }
    

})

app.get("*", function(req, res){
    res.sendFile(__dirname + "/client/index.html");
})
