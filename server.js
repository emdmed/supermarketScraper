
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

//TEST

//api_handler.get_product.dia("galletitas")
//api_handler.get_product.coto("tomate")

app.post("/test", async function (req, res){

    console.log("TEST ROUTE");
    res.status(200).end();

});


app.post("/products_dia", async function(req, res){

    let product = req.body.product;
    let dia;

    try{
        dia = await api_handler.get_product.dia(product);
        await dia;
        console.log(dia);
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
        coto = await api_handler.get_product.coto(product);
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
        disco = await api_handler.get_product.disco(product);
        await disco;
        console.log(disco);
        res.status(200).send(disco).end();
    }catch(err){
        console.log(err);
        res.status(404).end();
    }
    

})

/*
app.post("/get_products", async function(req, res){
    
        let product = req.body.product;
        let dia;
        let coto;
        let disco;
        let send_object = [];

        
        try{
            dia = await api_handler.get_product.dia(product);
            await dia;
            console.log(dia);
        }catch(err){
            console.log(err);
        }
        
        
        try{
            coto = await api_handler.get_product.coto(product);
            await coto
            //console.log(coto)
        }catch(err){
            console.log(err)
        }

     
        try{
            disco = await api_handler.get_product.disco(product);
            await disco
            //console.log(disco)
        }catch(err){
            console.log(err)
        }

        console.log("loop send object");
        
        for(let i = 0; i < 10; i++){
            send_object.push(dia[i]);
        }
        
        console.log("Dia done")

        for(let o = 0; o < 10; o++){
            send_object.push(coto[o]);
        }
        
        console.log("Coto done")
        
        for(let u = 0; u < 10; u++){
            send_object.push(disco[u]);
        }
        
        console.log("Disco done");

        res.status(200).send(send_object).end();

})
*/

app.get("*", function(req, res){
    res.sendFile(__dirname + "/client/index.html");
})
