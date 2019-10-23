var config;


$("#buscar_btn").click(async function(){
    let product = $("#input_product").val();

    $("#found_coto").hide()
    $("#found_dia").hide()
    $("#found_disco").hide()

    render_supermarkets(config)

    //show loading gif 
    $("#loading").show();
    $("#product_cards_here").empty();

    console.log("run post request");
    $(this).attr("disabled", true)

    let all_products = [];
    let dia;
    let coto;
    let disco;
    let jumbo;


    if(config.supermarkets.dia === true){
        $("#pending_dia").css({
            "border-bottom-color": "grey", 
            "border-bottom-width":"3px", 
            "border-bottom-style":"solid"
        });
        try{
            dia = await dia_products(product);
        }catch(err){
            console.log(err);
            dia = [];
        }
      
    } 

    if(config.supermarkets.coto === true){
        $("#pending_coto").css({
            "border-bottom-color": "grey", 
            "border-bottom-width":"3px", 
            "border-bottom-style":"solid"
        });
        try{
            coto = await coto_products(product);
        }catch(err){
            console.log(err)
            coto = [];
        }
    } 

    if(config.supermarkets.disco === true){
        $("#pending_disco").css({
            "border-bottom-color": "grey", 
            "border-bottom-width":"3px", 
            "border-bottom-style":"solid"
        });
        try{
            disco = await disco_products(product);
        }catch(err){
            console.log("error"),
            disco = [];
        }
    } 

    if(config.supermarkets.jumbo === true){
        $("#pending_jumbo").css({
            "border-bottom-color": "grey", 
            "border-bottom-width":"3px", 
            "border-bottom-style":"solid"
        });
        try{
            jumbo = await jumbo_products(product);
        }catch(err){
            console.log(err)
            jumbo = [];
        }
    } 


    //push responses to all_products
    if(config.supermarkets.dia === true){
        for(let d = 0; d < dia.length; d++){
            all_products.push(dia[d]);
        }
    } 

    if(config.supermarkets.coto === true){
        for(let c = 0; c < coto.length; c++){
            all_products.push(coto[c]);
        }
    } 

    if(config.supermarkets.disco === true){
        for(let i = 0; i < disco.length; i++){
            all_products.push(disco[i]);
        }
    } 

    if(config.supermarkets.jumbo === true){
        for(let i = 0; i < jumbo.length; i++){
            all_products.push(jumbo[i]);
        }
    } 

    //order items by price
    let ordered_products = all_products.sort((a, b) => (a.int_price > b.int_price) ? 1 : -1)

    render_n_products(ordered_products);

    $("#input_product").val("");
    $("#loading").hide();
    $(this).attr("disabled", false);
    $("#pending_dia").css({
        "border-bottom": "none"
    });
    $("#pending_coto").css({
        "border-bottom": "none"
    });
    $("#pending_disco").css({
        "border-bottom": "none"
    });
})


async function dia_products(product){
    let products =  await $.ajax({
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
    let products = await $.ajax({
        url: "/products_coto",
        method: "POST",
        data: {product: product},
        success: function(res){
            console.log("COTO>>");
            console.log(res)
            let product = res;
           $("#found_coto").show()
           $("#pending_coto").hide();
           return product
        }
    })
    return products
}

async function disco_products(product){
    console.log("request disco")
    let products =  await $.ajax({
        url: "/products_disco",
        method: "POST",
        data: {product: product},
        success: function(res){
            console.log("DISCO>>");
            console.log(res)
            let product = res;
           $("#found_disco").show()
           $("#pending_disco").hide();
           return product
        },
        error: function(res){
            console.log("Error");
            console.log(res);
            return [];
        }
    })

    console.log("prod: ", products);
    return products
}

async function jumbo_products(product){
    let products = await $.ajax({
        url: "/products_jumbo",
        method: "POST",
        data: {product: product},
        success: function(res){
            console.log("JUMBO>>");
            console.log(res)
            let product = res;
           $("#found_coto").show()
           $("#pending_coto").hide();
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

function render_n_products(products){
    for(let i = 0; i < config.show_n_products; i++){
        $("#product_cards_here").append(`
        <div class="card text-center product-card mx-auto">
            <div class="card-header">
                <h5>${products[i].name}</h5>
                <h5 class="font-weight-bold">${products[i].price}</h5>
            </div>
            <div class="card-body text-center">
                <p>${products[i].local}</p>
                <img class="product-image" src="${products[i].image}">
            </div>
            <br>
            <script async defer crossorigin="anonymous" src="https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v4.0"></script>
            <div class="fb-like" data-href="https://tobara.co/${products[i].url_name}" data-width="200" data-layout="box_count" data-action="recommend" data-size="small" data-show-faces="true" data-share="false"></div>
            <div class="fb-comments" data-href="https://www.tobara.co/${products[i].url_name}" data-width="200" data-numposts="5"></div>
            <br>
        </div>
        <br>
    `);
    }
}


function onload(){
    $.ajax({
        url: "/config",
        method: "GET",
        success: function(res){
            config = res;
            render_supermarkets(config);
            console.log("connected...")
            $("#buscar_btn").attr("disabled", false);
        }
    })
}

function render_supermarkets(config){

    if(config.supermarkets.dia === false){
        $("#pending_dia").hide();
    } else {
        $("#pending_dia").show();
    }

    if(config.supermarkets.coto === false){
        $("#pending_coto").hide();
    } else {
        $("#pending_coto").show();
    }

    if(config.supermarkets.disco === false){
        $("#pending_disco").hide();
    } else {
        $("#pending_coto").show();
    }

    if(config.supermarkets.jumbo === false){
        $("#pending_jumbo").hide();
    } else {
        $("#pending_jumbo").show();
    }

}

