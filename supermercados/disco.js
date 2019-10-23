const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const disco = {
    get_products:  async function(product){
        url = "https://www.disco.com.ar/Comprar/Home.aspx#_atCategory=false&_atGrilla=true&_query=";
        let products = [];
        let

        //Boot Puppeteer
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        await page.setRequestInterception(true);
    
        const page = await browser.newPage();

        //dismiss browser geoloc request
        await page.evaluateOnNewDocument(function() {
            navigator.geolocation.getCurrentPosition = function (cb) {
              setTimeout(() => {
                cb({
                  'coords': {
                    accuracy: 21,
                    altitude: null,
                    altitudeAccuracy: null,
                    heading: null,
                    latitude: -34.583191,
                    longitude: -58.473493,
                    speed: null
                  }
                })
              }, 500)
            }
          });
             
        try{
            console.log(url+product)
            await page.goto(url+product);
        }catch(err){
            console.log("page not found");
            return [];
        }
  
        //await page.waitForSelector("#product-list");
        try{
            console.log("get selector");
            let selector = await page.waitForSelector(".grilla-producto-container");
            console.log(selector)

        }catch(err){
            console.log("could not find selector");
        }
        

        console.log("boot evaluate...")
        let products_array = await page.evaluate(()=>{
            let products_array = [];
            let all_products = document.querySelectorAll(".grilla-producto-container")
            for(let i = 0; i < all_products.length; i++){
                products_array.push(all_products[i].innerHTML);
            }

            return products_array
        })

        //input html to cheerio
        for(let p = 0; p < products_array.length; p++){
            let $ = cheerio.load(products_array[p]);

            let full = $(".grilla-producto-precio").text();
            let cents = $(".grilla-producto-precio").find("span").text();
            let pre_final = full.replace(cents, "") + "," + cents
            let final = pre_final.replace(/ /g,'');
            let url_name = $$(".grilla-producto-descripcion").text().replace(/ /g, "_");

            let item = {
                name: $(".grilla-producto-descripcion").text(),
                price: final,
                int_price: parseFloat(final.replace(",", ".").replace("$", "")),
                image: $(".centered-image.small.lazy").attr("data-original"),
                local: "Supermercado Disco",
                url_name
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

module.exports = disco;