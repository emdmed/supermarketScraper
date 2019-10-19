$("#buscar_btn").click(function(){
    let product = $("#input_product").val();

    //show loadgin gif 
    $("#loading").show();

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
})


function render_products(products){

    $("#product_cards_here").empty();
    products.forEach(element => {

       

       
            $("#product_cards_here").append(`
            <div class="card text-center">
                <h5>${element.name}</h5>
                <p>${element.price}</p>
                <p>${element.local}</p>
                <div class="card-body text-center">
                    <img src="${element.image}">
                </div>
            </div>
        `)
        
      
    });
}
