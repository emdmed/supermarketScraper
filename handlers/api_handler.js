const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

const api_handler = {
    get_product: {
        dia : async function(product){
            url = "https://diaonline.supermercadosdia.com.ar/busca/?ft=";
            let products = [];

            //PUPPTEER AND CHEERIO

            const browser = await puppeteer.launch({headless: false});
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

                let item = {
                    name: $(".ellip").text(),
                    price: $(".best-price").text(),
                    image: $(".productImage").find("img").attr("src"),
                    int_price: function(){
                        let remove_sign = this.price.replace("$", "").replace(",", ".");
                        return parseFloat(remove_sign);
                    }
                }

                products.push(item);
            }

         
            //console.log(products);
            return products;
        },
        coto: async function(product){
            url = `https://www.cotodigital3.com.ar/sitios/cdigi/browse?_dyncharset=utf-8&Dy=1&Ntt=${product}%7C1004&Nty=1&Ntk=All%7Cproduct.sDisp_200&siteScope=ok&_D%3AsiteScope=+&atg_store_searchInput=tomates&idSucursal=200&_D%3AidSucursal=+&search=Ir&_D%3Asearch=+&_DARGS=%2Fsitios%2Fcartridges%2FSearchBox%2FSearchBox.jsp`;
            let products = [];

             

            //PUPPTEER AND CHEERIO

            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            await page.goto(url+product);
            await page.waitFor(4000)

            let products_array = await page.evaluate(()=>{
                let products_array = [];
                let all_products = document.querySelectorAll(".clearfix")
                console.log(all_products)
                for(let i = 0; i < all_products.length; i++){
                    //console.log(all_products[i].innerHTML)
                    products_array.push(all_products[i].innerHTML);
                }

                return products_array
            })

            //input to cheerio

            console.log(products_array); 
            console.log("booting cheerio...")

            for(let p = 0; p < products_array.length; p++){
                let $ = cheerio.load(products_array[p]);
                console.log(products_array[p]);

                let item = {
                    name: $(".descrip_full").text(),
                    price: function(){
                        let p = $(".atg_store_newPrice").text()
                        console.log("p ", p)
                        let raw_price = $(".atg_store_newPrice").text().replace(/(\r\n|\n|\r|\t)/gm, "").replace(/ /g,'')
                        console.log(raw_price);
                        let prices = raw_price.split("$");
                        console.log(prices);
                        let price = prices[1].replace("PRECIOCONTADO", "");
                    
                        console.log(price);
                    },
                    image: $(".productImage").find("img").attr("src"),
                    int_price: function(){
                        let remove_sign = this.price.replace("$", "").replace(",", ".");
                        return parseFloat(remove_sign);
                    }
                }

                //products.push(item);
                item.price();
            }

            console.log(products);

        },
        disco: async function(product){
            url = "https://www.disco.com.ar/Comprar/Home.aspx#_atCategory=false&_atGrilla=true&_query=";
            let products = [];

            //PUPPTEER AND CHEERIO

            const browser = await puppeteer.launch({headless: false});
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
                console.log("all products ", all_products)
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
                console.log(products_array[p]);

                let item = {
                    name: $(".grilla-producto-descripcion").text(),
                    price: $(".grilla-producto-precio").text(), //remove span from price 
                    image: $(".centered-image.small.lazy").attr("data-original")
                }

                products.push(item);
                
            }

            console.log(products)
            
        }
    }
}











module.exports = api_handler;