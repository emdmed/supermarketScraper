const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const dia = {
    get_products: async function(product){
        url = "https://diaonline.supermercadosdia.com.ar/busca/?ft=";
                let products = [];

                //Boot Pupeteer
                const browser = await puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                });
                const page = await browser.newPage();
                await page.goto(url+product);
                await page.waitForSelector(".product");
    
                let products_array = await page.evaluate(()=>{
                    let products_array = [];
                    let all_products = document.querySelectorAll(".product")
                    for(let i = 0; i < all_products.length; i++){
                        products_array.push(all_products[i].innerHTML);
                    }

                    return products_array
                })
    
                //input html to Cheerio
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

                    filter_undefined(item, products);
                }
                
                await browser.close();
                return products;
    }
}

function filter_undefined(item, products){
    if(item.name === undefined || item.name === "" || item.price === undefined ||item.price === "$undefined"){
        //console.log("undefined product price or name")
    } else {
        products.push(item);
    }
}

module.exports = dia;