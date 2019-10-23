const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const coto = {
    get_products: async function(product){
        url = `https://www.cotodigital3.com.ar/sitios/cdigi/browse?_dyncharset=utf-8&Dy=1&Ntt=${product}%7C1004&Nty=1&Ntk=All%7Cproduct.sDisp_200&siteScope=ok&_D%3AsiteScope=+&atg_store_searchInput=tomates&idSucursal=200&_D%3AidSucursal=+&search=Ir&_D%3Asearch=+&_DARGS=%2Fsitios%2Fcartridges%2FSearchBox%2FSearchBox.jsp`;
        let products = [];
        //Boot Puppeteer 
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
     
        await page.waitForSelector(".clearfix");

        let products_array = await page.evaluate(()=>{
            let products_array = [];
            let all_products = document.querySelectorAll(".clearfix")
            for(let i = 0; i < all_products.length; i++){
                products_array.push(all_products[i].innerHTML);
            }

            return products_array
        })
        //input data to Cheerio
        for(let p = 0; p < products_array.length; p++){
            let $ = cheerio.load(products_array[p]);
            //format price
            let raw_price = $(".atg_store_newPrice").text().replace(/(\r\n|\n|\r|\t)/gm, "").replace(/ /g,'');
            let sanitize1 = raw_price.replace(/PRECIOCONTADO/g, "")
            let sanitize2 = sanitize1.split("$")
            let price = sanitize2[1]
            let url_name = $(".descrip_full").text().replace(/ /g, "_");
            
            let item = {
                name: $(".descrip_full").text(),
                price: "$" + price,
                image: $(".atg_store_productImage").find("img").attr("src"),
                int_price: parseFloat(price),
                local: "Supermercado Coto",
                url_name
            }

            filter_undefined(item, products);
        }
        await browser.close();
        return products
    }
}

function filter_undefined(item, products){
    if(item.name === undefined || item.name === "" || item.price === undefined ||item.price === "$undefined"){
        //console.log("undefined product price or name")
    } else {
        products.push(item);
    }
}

module.exports = coto;