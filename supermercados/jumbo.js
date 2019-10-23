const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const jumbo = {
    get_products: async function(product){
        url = "https://www.jumbo.com.ar/busca/?ft=";
                let products = [];

                //Boot Pupeteer
                const browser = await puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                });
                
                const page = await browser.newPage();

                try{
                    await page.goto(url+product);
                }catch(err){
                    console.log("page not found");
                    return [];
                }

                try{
                    await page.waitForSelector(".product-item");
                } catch(err){
                    console.log("not found")
                    return [];
                }
                          
                let products_array = await page.evaluate(()=>{
                    let products_array = [];
                    let all_products = document.querySelectorAll(".product-item")
                    for(let i = 0; i < all_products.length; i++){
                        products_array.push(all_products[i].innerHTML);
                    }

                    return products_array
                })
    
                //input html to Cheerio
                for(let p = 0; p < products_array.length; p++){
                    let $ = cheerio.load(products_array[p]);
    
                    let price = $(".product-prices__value").text();
                    let int_price = parseFloat(remove_sign = price.replace("$", "").replace(",", "."));
                    let url_name = $(".product-prices__value.product-prices__value--best-price").text().replace(/ /g, "_");
    
                    let item = {
                        name: $(".product-item__name").find("a").text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                        price,
                        image: $(".product-item__image-link").find("img").attr("src"),
                        int_price: int_price,
                        local: "Supermercado Jumbo",
                        url_name
                    }

                    //console.log(item);
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

module.exports = jumbo;