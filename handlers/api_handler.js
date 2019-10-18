const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

const api_handler = {
    get_product: {
        dia : async function(product){
            url = "https://diaonline.supermercadosdia.com.ar/busca/?ft=";

            //PUPPTEER AND CHEERIO

            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            await page.goto(url+product);

            await page.evaluate(()=>{
                let all_products = document.querySelectorAll(".product")
                for(let i = 0; i < all_products.length; i++){
                    let $ = cheerio.load(all_products[i].innerHTML);
                    console.log(all_products[i].innerHTML)
                }
            })


            //ONLY CHEERIO
            /*
            url = "https://diaonline.supermercadosdia.com.ar/busca/?ft=";

            let res = await fetch(url+product);
            let html = await res.text();

            let products = [];

            let $ = cheerio.load(html);

            $(".vitrine").find(".product").each((i, element)=>{
                let $element = $(element);
                console.log($($element).find(".product__content").find(".new_quantity-field").text());
                
                let item = {
                    name: product,
                    price: $($element).find(".best-price").html(),
                    quantity: $($element).find(".new_quantity-field").text()
                }

                products.push(item);
            })

            console.log(products);
            
            return products*/

        }
    }
}









module.exports = api_handler;