
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const api_handler = require("./handlers/api_handler");

const server = require("http").createServer(app);

app.use(express.static(__dirname + "/client"));

server.listen(process.env.PORT || 3001);
console.log("Server running...")

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/config", function(req, res){

    res.send(api_handler.config).status(200).end();

});


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

    console.log("disco request")

    let product = req.body.product;
    let disco;

    try{
        disco = await api_handler.disco.get_products(product);
        await disco;
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
