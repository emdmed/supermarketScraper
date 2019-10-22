$("#buscar_btn").click(async function(){
    let product = $("#input_product").val();

    $("#found_coto").hide()
    $("#found_dia").hide()
    $("#found_disco").hide()

    $("#pending_dia").show();
    $("#pending_coto").show();
    $("#pending_disco").show();

    //show loadgin gif 
    $("#loading").show();
    $("#product_cards_here").empty();

    console.log("run post request");
    $(this).attr("disabled", true)

    let all_products = [];
    let dia = await dia_products(product);
    let coto = await coto_products(product);
    let disco = await disco_products(product);

    if (dia === "timeout" || coto === "timeout" || disco === "timeout"){

    } else {

        for(let d = 0; d < dia.length; d++){
            all_products.push(dia[d]);
        }
    
        for(let c = 0; c < coto.length; c++){
            all_products.push(coto[c]);
        }
    
        for(let i = 0; i < disco.length; i++){
            all_products.push(disco[i]);
        }
    }


    render_products(all_products);

    $("#loading").hide();
    $(this).attr("disabled", false);
})

async function dia_products(product){
    let products = $.ajax({
        url: "/products_dia",
        method: "POST",
        data: {product: product},
        success: function(res){
            console.log("DIA>>");
            console.log(res)
            let product = res;
            $("#found_dia").show()
            $("#pending_dia").hide();
            return product;
            /*$("#loading").hide();
            render_products(product);
            $(this).attr("disabled", false)*/
        }
    })
    return products
}

async function coto_products(product){
    let products = $.ajax({
        url: "/products_coto",
        method: "POST",
        data: {product: product},
        success: function(res){
            console.log("COTO>>");
            console.log(res)
            let product = res;
            /*
            $("#loading").hide();
            render_products(product);
            $(this).attr("disabled", false)
            */
           $("#found_coto").show()
           $("#pending_coto").hide();
           return product
        }
    })
    return products
}

async function disco_products(product){
    let products = $.ajax({
        url: "/products_disco",
        method: "POST",
        data: {product: product},
        success: function(res){
            console.log("DISCO>>");
            console.log(res)
            let product = res;
            /*
            $("#loading").hide();
            render_products(product);
            $(this).attr("disabled", false)
            */
           $("#found_disco").show()
           $("#pending_disco").hide();
           return product
        }
    })
    return products
}



function render_products(products){

  

    //order items by price
    let ordered_products = products.sort((a, b) => (a.int_price > b.int_price) ? 1 : -1)
   

    ordered_products.forEach(element => {  
        //console.log(element.int_price);
        $("#product_cards_here").append(`
            <div class="card text-center product-card mx-auto">
                <div class="card-body text-center">
                    <h5>${element.name}</h5>
                    <p>${element.price}</p>
                    <p>${element.local}</p>
              
                    <img class="product-image" src="${element.image}">
                </div>
                <br>
                <script async defer crossorigin="anonymous" src="https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v4.0"></script>
                <div class="fb-like" data-href="https://tobara.co/${element.url_name}" data-width="200" data-layout="box_count" data-action="recommend" data-size="small" data-show-faces="true" data-share="false"></div>
                <div class="fb-comments" data-href="https://www.tobara.co/${element.url_name}" data-width="200" data-numposts="5"></div>
                <br>
            </div>
            <br>
        `)
        console.log(element.url_name)
      
    });
}

