
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

app.post("/get_products", async function(req, res){
    
        let product = req.body.product;
        console.log("RUNNING")
        let dia;
        let coto;
        let disco;

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
            console.log(coto)
        }catch(err){
            console.log(err)
        }

        try{
            disco = await api_handler.get_product.disco(product);
            await disco
            console.log(disco)
        }catch(err){
            console.log(err)
        }
        

        let send_object = [];

        for(let i = 0; i < dia.length; i++){
            send_object.push(dia[i]);
        }

        /*

        for(let o = 0; o < coto.length; o++){
            send_object.push(coto[o]);
        }

        for(let u = 0; u < disco.length; u++){
            send_object.push(disco[u]);
        }
        */
    

        console.log(send_object);

        res.status(200).send(send_object).end();

})

app.get("*", function(req, res){
    res.sendFile(__dirname + "/client/index.html");
})
