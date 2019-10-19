const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

const api_handler = {
    get_product: {
        dia : async function(product){
            url = "https://diaonline.supermercadosdia.com.ar/busca/?ft=";
            let products = [];

            //PUPPTEER AND CHEERIO

            const browser = await puppeteer.launch({headless: true});
            const page = await browser.newPage();
            await page.goto(url+product);
            await page.waitFor(2000)

            let products_array = await page.evaluate(()=>{
                let products_array = [];
                let all_products = document.querySelectorAll(".product")
                for(let i = 0; i < all_products.length; i++){
                    //console.log(all_products[i].innerHTML)
                    products_array.push(all_products[i].innerHTML);
                }

                console.log(products_array);
                return products_array
            })

            //input to cheerio
            console.log("booting cheerio...")

            for(let p = 0; p < products_array.length; p++){
                let $ = cheerio.load(products_array[p]);

                let price = $(".best-price").text();
                let int_price = parseFloat(remove_sign = price.replace("$", "").replace(",", "."));

                let item = {
                    name: $(".ellip").text(),
                    price: $(".best-price").text(),
                    image: $(".productImage").find("img").attr("src"),
                    int_price: int_price,
                    local: "Supermercado Día"
                }

                //products.push(item);
                filter_undefined(item, products);
            }

         
            //console.log(products);
            return products;
        },
        coto: async function(product){
            url = `https://www.cotodigital3.com.ar/sitios/cdigi/browse?_dyncharset=utf-8&Dy=1&Ntt=${product}%7C1004&Nty=1&Ntk=All%7Cproduct.sDisp_200&siteScope=ok&_D%3AsiteScope=+&atg_store_searchInput=tomates&idSucursal=200&_D%3AidSucursal=+&search=Ir&_D%3Asearch=+&_DARGS=%2Fsitios%2Fcartridges%2FSearchBox%2FSearchBox.jsp`;
            let products = [];

            //PUPPTEER AND CHEERIO
            const browser = await puppeteer.launch({headless: true}, {args: ['--no-sandbox', '--disable-setuid-sandbox']});
            const page = await browser.newPage();
            await page.goto(url+product);
            await page.waitForSelector(".clearfix");

            let products_array = await page.evaluate(()=>{
                let products_array = [];
                let all_products = document.querySelectorAll(".clearfix")
                //console.log(all_products)
                for(let i = 0; i < all_products.length; i++){
                    console.log(all_products[i].innerHTML)
                    products_array.push(all_products[i].innerHTML);
                }

                return products_array
            })

            //input to cheerio

            //console.log(products_array); 
            console.log("booting cheerio...")

            for(let p = 0; p < products_array.length; p++){
                let $ = cheerio.load(products_array[p]);
                //console.log(products_array);

                //price

                let raw_price = $(".atg_store_newPrice").text().replace(/(\r\n|\n|\r|\t)/gm, "").replace(/ /g,'');
                let sanitize1 = raw_price.replace(/PRECIOCONTADO/g, "")
                let sanitize2 = sanitize1.split("$")
                let price = sanitize2[1]
                //console.log(sanitize3)


                
                let item = {
                    name: $(".descrip_full").text(),
                    price: "$" + price,
                    image: $(".atg_store_productImage").find("img").attr("src"),
                    int_price: parseFloat(price),
                    local: "Supermercado Coto"
                }

                //products.push(item);
                filter_undefined(item, products);
            }

            return products

        },
        disco: async function(product){
            url = "https://www.disco.com.ar/Comprar/Home.aspx#_atCategory=false&_atGrilla=true&_query=";
            let products = [];

            //PUPPTEER AND CHEERIO

            const browser = await puppeteer.launch({headless: true});
            const page = await browser.newPage();
            //dismiss geoloc request
            await page.evaluateOnNewDocument(function() {
                navigator.geolocation.getCurrentPosition = function (cb) {
                  setTimeout(() => {
                    cb({
                      'coords': {
                        accuracy: 21,
                        altitude: null,
                        altitudeAccuracy: null,
                        heading: null,
                        latitude: 23.129163,
                        longitude: 113.264435,
                        speed: null
                      }
                    })
                  }, 1000)
                }
              });
              
             
            await page.goto(url+product);
      
            await page.waitForSelector(".grilla-producto-container");

            let products_array = await page.evaluate(()=>{
                let products_array = [];
                let all_products = document.querySelectorAll(".grilla-producto-container")
                
                for(let i = 0; i < all_products.length; i++){
                    //console.log(all_products[i].innerHTML)
                    products_array.push(all_products[i].innerHTML);
                }

                return products_array
            })


            //input to cheerio
 
            console.log("booting cheerio...")

            for(let p = 0; p < products_array.length; p++){
                let $ = cheerio.load(products_array[p]);

                let full = $(".grilla-producto-precio").text();
                let cents = $(".grilla-producto-precio").find("span").text();
                let pre_final = full.replace(cents, "") + "," + cents
                let final = pre_final.replace(/ /g,'');

                let item = {
                    name: $(".grilla-producto-descripcion").text(),
                    price: final,
                    int_price: parseFloat(final.replace(",", ".").replace("$", "")),
                    image: $(".centered-image.small.lazy").attr("data-original"),
                    local: "Supermercado Disco"
                }  

                //products.push(item);
                filter_undefined(item, products);
            }

            //console.log(products)
            return products;
            
        }
    }
}

function filter_undefined(item, products){
    if(item.name === undefined || item.name === "" || item.price === undefined ||item.price === "$undefined"){
        console.log("undefined product price or name")
    } else {
        products.push(item);
    }
}











module.exports = api_handler;