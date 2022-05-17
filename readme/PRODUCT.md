# **API PRODUCT**

#### ***Base URL : http://api.iagora.id***

### Menampilkan Satu Product
**`URL : ${BaseURL}/api/v1/product/productId/get`**
```js
// AXIOS
await axios.get(`${baseURL}/api/v1/product/62235def9e814002330e32b1/get`)

// Contoh response
{
    "status": 200,
    "message": "Success",
    "result": {
        "_id": "62235def9e814002330e32b1",
        "product_name": "Pisang",
        "product_category": "Buah",
        "product_grade": "A",
        "product_image": "1646484975275.jpg",
        "product_price": "15000",
        "product_uom": "/sisir",
        "market": {
            "_id": "622342ee9ec09bf428b4dbcb",
            "name": "Pasar central buol",
            "address": "Jl.",
            "city": "6222f56b6d52dbb0b86d85c9",
            "isAccept": true,
            "createdAt": "2022-03-05T11:01:02.892Z",
            "updatedAt": "2022-03-05T12:56:15.374Z",
            "__v": 2,
            "products": [
                "6223519a33117bdb782d160b",
                "62235def9e814002330e32b1"
            ]
        },
        "isAccept": true,
        "createdAt": "2022-03-05T12:56:15.367Z",
        "updatedAt": "2022-03-05T12:56:15.367Z",
        "__v": 0
    }
}
```

### Menampilkan Semua product (Berdasarkan kategori)
**`URL : ${BaseURL}/api/v1/product/get-all`**
atau apabila ingin mnampilkan semua produk dalam kategori tertentu: 
**`URL : ${BaseURL}/api/v1/product/get-all/?category-name-query`**
```js
// AXIOS
await axios.get(`${baseURL}/api/v1/product/get-all`)
// Atau
await axios.get(`${baseURL}/api/v1/product/get-all/?category=Buah`)

// Semenatara ada 3 kategory yaitu : Buah, Sayur, dan Daging 

// Contoh response
{
    "status": 200,
    "message": "Success",
    "result": [
        {
            "_id": "62235def9e814002330e32b1",
            "product_name": "Pisang",
            "product_category": "Buah",
            "product_grade": "A",
            "product_image": "1646484975275.jpg",
            "product_price": "15000",
            "product_uom": "/sisir",
            "market": {
                "_id": "622342ee9ec09bf428b4dbcb",
                "name": "Pasar central buol",
                "address": "Jl.",
                "city": "6222f56b6d52dbb0b86d85c9",
                "isAccept": true,
                "createdAt": "2022-03-05T11:01:02.892Z",
                "updatedAt": "2022-03-05T12:56:15.374Z",
                "__v": 2,
                "products": [
                    "6223519a33117bdb782d160b",
                    "62235def9e814002330e32b1"
                ]
            },
            "isAccept": true,
            "createdAt": "2022-03-05T12:56:15.367Z",
            "updatedAt": "2022-03-05T12:56:15.367Z",
            "__v": 0
        }
    ]
}
```

# ENDPOINT KATEGORI PRODUK

**<details><summary>List Endpoint</summary>**
### **1. Menampilkan semua kategori produk**

**`URL : ${BaseURL}/api/v1/product/category/get-all`**
```js
// AXIOS

await axios.get(`${baseURL}/api/v1/product-category/get-all`)

// Contoh response
{
    "status": 200,
    "message": "Success",
    "result": [
        {
            "_id": "6239ad12a34d3b82f4fd2dd9",
            "name": "Buah"
        },
        {
            "_id": "6239b4bfe05f770c3792732f",
            "name": "Sayur"
        }
    ]
}
```
</details>
