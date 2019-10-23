const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const disco = {
    get_products: async function(product){
        url = "https://www.disco.com.ar/Comprar/Home.aspx#_atCategory=false&_atGrilla=true&_query=";
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
                    await page.waitForSelector(".grilla-producto-container");
                } catch(err){
                    console.log("selector not found")
                    return [];
                }
                          
                let products_array = await page.evaluate(()=>{
                    let products_array = [];
                    let all_products = document.querySelectorAll(".grilla-producto-container")
                    for(let i = 0; i < all_products.length; i++){
                        products_array.push(all_products[i].innerHTML);
                    }

                    return products_array
                })
    
                //input html to Cheerio
                for(let p = 0; p < products_array.length; p++){
                    let $ = cheerio.load(products_array[p]);
    
                    let price = $(".grilla-producto-precio").text();
                    let span = $(".grilla-producto-precio").find("span");
                    let int_price = parseFloat(remove_sign = price.replace("$", "").replace(",", "."));
                    let url_name = $(".grilla-producto-precio").text().replace(/ /g, "_");
    
                    let item = {
                        name: $(".grilla-producto-descripcion").text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                        price,
                        image: $(".grilla-producto-imagen").find("img").attr("data-original"),
                        int_price: int_price,
                        local: "Supermercado disco",
                        url_name
                    }

                    console.log(item);
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

module.exports = disco;