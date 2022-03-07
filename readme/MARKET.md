# **API PASAR**

#### ***Base URL : http://api.iagora.id***

### Menampilkan Satu Pasar beserta productnya
**`URL : ${BaseURL}/api/v1/market/marketId/get`**
```js
// AXIOS
await axios.get(`${baseURL}/api/v1/market/622342ee9ec09bf428b4dbcb/get`)

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
        "updatedAt": "2022-03-05T12:56:15.374Z",
        "__v": 2,
        "products": [
            {
                "_id": "62235def9e814002330e32b1",
                "product_name": "Pisang",
                "product_category": "Buah",
                "product_grade": "A",
                "product_image": "1646484975275.jpg",
                "product_price": "15000",
                "product_uom": "/sisir",
                "market": "622342ee9ec09bf428b4dbcb",
                "isAccept": true,
                "createdAt": "2022-03-05T12:56:15.367Z",
                "updatedAt": "2022-03-05T12:56:15.367Z",
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