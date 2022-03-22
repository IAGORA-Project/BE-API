# **API PASAR**

#### ***Base URL : http://api.iagora.id***

### Menampilkan Satu Pasar beserta productnya
**`URL : ${BaseURL}/api/v1/market/marketId/get?categoryId=6239ad12a34d3b82f4fd2dd9`**
Endpoint menampilkan data pasar beserta produknya membutuhkan parameter categoryId, jika parameternya kosong atau tidak terisi maka akan ditampilkan semua data produk yang berada di pasar tersebut. Jika categoryId terisi dengan ID kategori maka data produk yang di tampilkan akan terfilter berdasarkan kategori produknya.

```js
// AXIOS
await axios.get(`${baseURL}/api/v1/market/622342ee9ec09bf428b4dbcb/get?categoryId=6239ad12a34d3b82f4fd2dd9`)

// Contoh response
{
    "status": 200,
    "message": "Success",
    "result": {
        "_id": "622342ee9ec09bf428b4dbcb",
        "name": "Pasar central buol",
        "address": "Jl.",
        "city": "6222f56b6d52dbb0b86d85c9",
        "isAccept": true,
        "createdAt": "2022-03-05T11:01:02.892Z",
        "updatedAt": "2022-03-22T11:37:21.009Z",
        "__v": 7,
        "products": [
            {
                "_id": "6239b3d1e05f770c37927329",
                "product_name": "Semangka",
                "product_category": "6239ad12a34d3b82f4fd2dd9",
                "product_grade": "A",
                "product_image": "http://localhost:5050/image/product/1647948753382.jpg",
                "product_price": "8000",
                "product_uom": "/kg",
                "market": "622342ee9ec09bf428b4dbcb",
                "isAccept": true,
                "createdAt": "2022-03-22T11:32:33.414Z",
                "updatedAt": "2022-03-22T11:32:33.414Z",
                "__v": 0
            }
        ]
    }
}
```

### Menampilkan Semua Pasar
**`URL : ${BaseURL}/api/v1/market/get-all`**
```js
// AXIOS
await axios.get(`${baseURL}/api/v1/market/get-all`)

// Contoh response
{
    "status": 200,
    "message": "Success",
    "result": [
        {
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
        {
            "_id": "622360c349610e7187ff0f2b",
            "name": "Pasar tradisional buol",
            "address": "JL",
            "city": "6222f56b6d52dbb0b86d85c9",
            "products": [],
            "isAccept": true,
            "createdAt": "2022-03-05T13:08:19.861Z",
            "updatedAt": "2022-03-05T13:08:19.861Z",
            "__v": 0
        }
    ]
}
```