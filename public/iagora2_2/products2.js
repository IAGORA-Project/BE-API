fetch(`http://localhost:5050/api/v1/auth/get-token`, {
    headers: {
        auth: `ini rahasia`
    }
}).then(res => {
    console.log(res.headers.get('sessid'))
    fetch(`http://localhost:5050/api/v1/product/read-all-product`, {
        headers: {
            buffer: `no buffer`,
            sessid: res.headers.get(`sessid`)
        }
    })    
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        appendData(data)
    })
    .catch(function (err) {
        console.log('error: ' + err);
    });
}).catch(function (err) {
    console.log('error: ' + err);
});

function appendData(data) {
    var mainContainer = document.getElementById("myproducts");
    for (var i = 0; i < data.result.length; i++) {
        var div = document.createElement("div");
        div.className = 'mb-4 col-lg-3 col-6'
        div.innerHTML =
            '<div class="card">' +
                '<img src=data:image/png;base64,' + data.result[i].product_image + '>' +
                '<div class="product-text">' +
                    '<h4 class="product-name"><b>' + data.result[i].product_name + '</b></h4>' +
                    '<p class="product-price"><b> Rp. ' + Number(data.result[i].product_price).toLocaleString() + '&nbsp;' + data.result[i].product_uom + '</b>' +
                '</div>'
            '</div>'
        mainContainer.appendChild(div);
    }
}