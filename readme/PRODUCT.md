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

### Menampilkan Semua Product (memakai query nama produk)
**`URL : ${BaseURL}/api/v1/product/get-specific-product/?productName=xxx`**

```js
// AXIOS
await axios.get(`${baseURL}/api/v1/product/get-specific-product/?productName=ang`)

//Query search bersifat CASE INSENSITIVE

// Contoh response
{
    "status": 200,
    "message": "Success",
    "result": [
        {
            "_id": "627e60d2e3a006a9bddbd197",
            "product_name": "Pisang",
            "product_category": "627e4f8a14a05494faa0157d",
            "product_grade": "627e56fce8546f6f31b5b6f4",
            "product_image": "1652449490390.jpg",
            "product_price": 15000,
            "product_uom": "/sisir",
            "market": {
                "_id": "627e3e67970d6128a93fc7cd",
                "name": "Pasar Kranggan",
                "address": "JL",
                "city": "627e3e3a970d6128a93fc7c8",
                "products": [
                    "627e60d2e3a006a9bddbd197",
                    "627e6381e3a006a9bddbd19f",
                    "62821ba3d5fc4d511c4bc30f",
                    "62824a73cfa0592f2db75484",
                    "62824aa2cfa0592f2db7548a",
                    "62824ac1cfa0592f2db75490",
                    "62824ad1cfa0592f2db75496",
                    "6284b28a37dafd4e4185a5e7"
                ],
                "isAccept": true,
                "createdAt": "2022-05-13T11:17:59.345Z",
                "updatedAt": "2022-05-18T08:47:06.139Z",
                "__v": 8
            },
            "isAccept": true,
            "createdAt": "2022-05-13T13:44:50.470Z",
            "updatedAt": "2022-05-13T13:44:50.470Z",
            "__v": 0
        },
        {
            "_id": "627e6381e3a006a9bddbd19f",
            "product_name": "Anggur",
            "product_category": "627e4f8a14a05494faa0157d",
            "product_grade": "627e5707e8546f6f31b5b6f7",
            "product_image": "1652450177291.jpeg",
            "product_price": 10000,
            "product_uom": "/kg",
            "market": {
                "_id": "627e3e67970d6128a93fc7cd",
                "name": "Pasar Kranggan",
                "address": "JL",
                "city": "627e3e3a970d6128a93fc7c8",
                "products": [
                    "627e60d2e3a006a9bddbd197",
                    "627e6381e3a006a9bddbd19f",
                    "62821ba3d5fc4d511c4bc30f",
                    "62824a73cfa0592f2db75484",
                    "62824aa2cfa0592f2db7548a",
                    "62824ac1cfa0592f2db75490",
                    "62824ad1cfa0592f2db75496",
                    "6284b28a37dafd4e4185a5e7"
                ],
                "isAccept": true,
                "createdAt": "2022-05-13T11:17:59.345Z",
                "updatedAt": "2022-05-18T08:47:06.139Z",
                "__v": 8
            },
            "isAccept": true,
            "createdAt": "2022-05-13T13:56:17.308Z",
            "updatedAt": "2022-05-13T13:56:17.308Z",
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
