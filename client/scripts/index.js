$("#buscar_btn").click(function(){
    let product = $("#input_product").val();

    $.ajax({
        url: "/get_products",
        method: "POST",
        data: {product: product},
        success: function(res){
            console.log(res)
        }
    })


})