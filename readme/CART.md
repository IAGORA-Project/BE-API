# **API CART**

#### ***Base URL : http://api.iagora.id***

### Menambahkan product ke keranjang
**`URL : ${BaseURL}/api/v1/cart/user/:userId/product/:productId/add`**
```js
// AXIOS
const body = {
    "quantity": 1,
    "note": "Test note semangka."
}
await axios.post(`${baseURL}/api/v1/cart/user/6218bb4d03faab15554bb78b/product/62235def9e814002330e32b1/add`, body, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Cart id: 624e45c4472171a1a5e2a254 updated",
    "result": {
        "_id": "624e45c4472171a1a5e2a254",
        "user": "6218bb4d03faab15554bb78b",
        "products": [
            {
                "productDetail": {
                    "_id": "6239b4f1e05f770c37927334",
                    "product_name": "Terong",
                    "product_grade": {
                        "_id": "623a5ee1e6342137aa5333a0",
                        "grade": "B",
                        "fee": 500
                    },
                    "product_image": "http://localhost:5050/image/product/1647949040996.jpg",
                    "product_price": 10000,
                    "product_uom": "/kg"
                },
                "quantity": 1,
                "subTotal": 10000,
                "handlingFee": 500,
                "note": "Test note terong."
            },
            {
                "productDetail": {
                    "_id": "6239b3d1e05f770c37927329",
                    "product_name": "Semangka",
                    "product_grade": {
                        "_id": "623a5ebde6342137aa53339d",
                        "grade": "A",
                        "fee": 1000
                    },
                    "product_image": "http://localhost:5050/image/product/1647948753382.jpg",
                    "product_price": 8000,
                    "product_uom": "/kg"
                },
                "quantity": 1,
                "subTotal": 8000,
                "handlingFee": 1000,
                "note": "Test note semangka."
            }
        ],
        "total": 18000,
        "totalHandlingFee": 1500,
        "createdAt": "2022-04-07T02:00:36.991Z",
        "updatedAt": "2022-04-07T02:02:07.172Z",
        "__v": 1
    }
}
```

### Update quantity
**`URL : ${BaseURL}/api/v1/cart/user/:userId/product/:productId/update-quantity`**
```js
// AXIOS
const body = {
    "quantity": 4
}

await axios.put(`${baseURL}/api/v1/cart/user/6218bb4d03faab15554bb78b/product/62235def9e814002330e32b1/update-quantity`, body, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Cart id: 6240f896bf3d2b67f8190599 updated",
    "result": {
        "_id": "6240f896bf3d2b67f8190599",
        "user": "6218bb4d03faab15554bb78b",
        "products": [
            {
                "productDetail": {
                    "_id": "6239b3d1e05f770c37927329",
                    "product_name": "Semangka",
                    "product_grade": {
                        "_id": "623a5ebde6342137aa53339d",
                        "grade": "A"
                    },
                    "product_image": "http://localhost:5050/image/product/1647948753382.jpg",
                    "product_price": 8000,
                    "product_uom": "/kg"
                },
                "quantity": 1,
                "subTotal": 8000,
                "handlingFee": 1000
            },
            {
                "productDetail": {
                    "_id": "6239b4f1e05f770c37927334",
                    "product_name": "Terong",
                    "product_grade": {
                        "_id": "623a5ee1e6342137aa5333a0",
                        "grade": "B"
                    },
                    "product_image": "http://localhost:5050/image/product/1647949040996.jpg",
                    "product_price": 10000,
                    "product_uom": "/kg"
                },
                "quantity": 4,
                "subTotal": 40000,
                "handlingFee": 2000
            }
        ],
        "total": 48000,
        "totalHandlingFee": 3000,
        "createdAt": "2022-03-27T23:51:50.231Z",
        "updatedAt": "2022-03-27T23:56:12.139Z",
        "__v": 1
    }
}
```

### Menghapus satu data product dari keranjang
**`URL : ${BaseURL}/api/v1/cart/user/:userId/product/:productId/delete-one-product`**
```js
// AXIOS

await axios.delete(`${baseURL}/api/v1/cart/user/6218bb4d03faab15554bb78b/product/62235def9e814002330e32b1/delete-one-product`, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Cart id: 6240f896bf3d2b67f8190599 updated",
    "result": {
        "_id": "6240f896bf3d2b67f8190599",
        "user": "6218bb4d03faab15554bb78b",
        "products": [
            {
                "productDetail": {
                    "_id": "6239b3d1e05f770c37927329",
                    "product_name": "Semangka",
                    "product_grade": {
                        "_id": "623a5ebde6342137aa53339d",
                        "grade": "A"
                    },
                    "product_image": "http://localhost:5050/image/product/1647948753382.jpg",
                    "product_price": 8000,
                    "product_uom": "/kg"
                },
                "quantity": 1,
                "subTotal": 8000,
                "handlingFee": 1000
            }
        ],
        "total": 8000,
        "totalHandlingFee": 1000,
        "createdAt": "2022-03-27T23:51:50.231Z",
        "updatedAt": "2022-03-27T23:57:33.692Z",
        "__v": 1
    }
}
```

### Menghapus semua data product dari keranjang
**`URL : ${BaseURL}/api/v1/cart/user/:userId/delete-all`**
```js
// AXIOS

await axios.delete(`${baseURL}/api/v1/cart/user/6218bb4d03faab15554bb78b/delete-all`, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 202,
    "message": "Cart id: 6240f896bf3d2b67f8190599 berhasil dihapus.",
    "result": null
}
```

### Menampilkan data keranjang
**`URL : ${BaseURL}/api/v1/cart/user/:userId/get`**
```js
// AXIOS

await axios.get(`${baseURL}/api/v1/cart/user/6218bb4d03faab15554bb78b/get`, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Cart id: 6240f896bf3d2b67f8190599 updated",
    "result": {
        "_id": "6240f896bf3d2b67f8190599",
        "user": "6218bb4d03faab15554bb78b",
        "products": [
            {
                "productDetail": {
                    "_id": "6239b3d1e05f770c37927329",
                    "product_name": "Semangka",
                    "product_grade": {
                        "_id": "623a5ebde6342137aa53339d",
                        "grade": "A",
                        "fee": 1000
                    },
                    "product_image": "http://localhost:5050/image/product/1647948753382.jpg",
                    "product_price": 8000,
                    "product_uom": "/kg"
                },
                "quantity": 1,
                "subTotal": 8000,
                "handlingFee": 1000
            },
            {
                "productDetail": {
                    "_id": "6239b4f1e05f770c37927334",
                    "product_name": "Terong",
                    "product_grade": {
                        "_id": "623a5ee1e6342137aa5333a0",
                        "grade": "B",
                        "fee": 500
                    },
                    "product_image": "http://localhost:5050/image/product/1647949040996.jpg",
                    "product_price": 10000,
                    "product_uom": "/kg"
                },
                "quantity": 0.5,
                "subTotal": 5000,
                "handlingFee": 250
            }
        ],
        "total": 13000,
        "totalHandlingFee": 1250,
        "createdAt": "2022-03-27T23:51:50.231Z",
        "updatedAt": "2022-03-27T23:52:22.817Z",
        "__v": 1
    }
}
```