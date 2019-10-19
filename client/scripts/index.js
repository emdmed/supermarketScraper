$("#buscar_btn").click(function(){
    let product = $("#input_product").val();

    //show loadgin gif 
    $("#loading").show();

    console.log("runn post request");

    $.ajax({
        url: "/products_disco",
        method: "POST",
        data: {product: product},
        success: function(res){

            console.log(res)
            let product = res;
              $("#loading").hide();
            render_products(product);
          
        }
    })

    /*
    $.ajax({
        url: "/get_products",
        method: "POST",
        data: {product: product},
        success: function(res){

            console.log(res)
            let product = res;
              $("#loading").hide();
            render_products(product);
          
        }
    })
    */
})


function render_products(products){

    $("#product_cards_here").empty();

    //order items by price
    let ordered_products = products.sort((a, b) => (a.int_price > b.int_price) ? 1 : -1)
   

    ordered_products.forEach(element => {  
        console.log(element.int_price);
        $("#product_cards_here").append(`
            <div class="card text-center product-card mx-auto">
                <div class="card-body text-center">
                    <h5>${element.name}</h5>
                    <p>${element.price}</p>
                    <p>${element.local}</p>
              
                    <img class="product-image" src="${element.image}">
                </div>
            </div>
            <br>
        `)
        
      
    });
}
