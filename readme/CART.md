# **API CART**

#### ***Base URL : http://api.iagora.id***

### Menambahkan product ke keranjang
**`URL : ${BaseURL}/api/v1/cart/user/:userId/product/:productId/add`**
```js
// AXIOS
await axios.post(`${baseURL}/api/v1/cart/user/6218bb4d03faab15554bb78b/product/62235def9e814002330e32b1/add`, {}, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Cart id: 623aafa8874bafa4efa0f154 updated",
    "result": {
        "_id": "623aafa8874bafa4efa0f154",
        "user": "6218bb4d03faab15554bb78b",
        "products": [
            {
                "productDetail": {
                    "_id": "6239b4f1e05f770c37927334",
                    "product_name": "Terong",
                    "product_grade": {
                        "_id": "623a5ee1e6342137aa5333a0",
                        "grade": "B",
                        "charge": 500
                    },
                    "product_image": "http://localhost:5050/image/product/1647949040996.jpg",
                    "product_price": 10000,
                    "product_uom": "/kg"
                },
                "quantity": 1,
                "subTotal": 10500
            },
            {
                "productDetail": {
                    "_id": "6239b3d1e05f770c37927329",
                    "product_name": "Semangka",
                    "product_grade": {
                        "_id": "623a5ebde6342137aa53339d",
                        "grade": "A",
                        "charge": 1000
                    },
                    "product_image": "http://localhost:5050/image/product/1647948753382.jpg",
                    "product_price": 8000,
                    "product_uom": "/kg"
                },
                "quantity": 1,
                "subTotal": 9000
            }
        ],
        "total": 19500,
        "createdAt": "2022-03-23T05:27:04.325Z",
        "updatedAt": "2022-03-23T05:50:49.726Z",
        "__v": 4
    }
}
```

### Update quantity
**`URL : ${BaseURL}/api/v1/cart/user/:userId/product/:productId/update-quantity`**
```js
// AXIOS
const data = {
    "quantity": 4
}

await axios.put(`${baseURL}/api/v1/cart/user/6218bb4d03faab15554bb78b/product/62235def9e814002330e32b1/update-quantity`, data, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Cart id: 623aafa8874bafa4efa0f154 updated",
    "result": {
        "_id": "623aafa8874bafa4efa0f154",
        "user": "6218bb4d03faab15554bb78b",
        "products": [
            {
                "productDetail": {
                    "_id": "6239b4f1e05f770c37927334",
                    "product_name": "Terong",
                    "product_grade": {
                        "_id": "623a5ee1e6342137aa5333a0",
                        "grade": "B",
                        "charge": 500
                    },
                    "product_image": "http://localhost:5050/image/product/1647949040996.jpg",
                    "product_price": 10000,
                    "product_uom": "/kg"
                },
                "quantity": 4,
                "subTotal": 42000
            },
            {
                "productDetail": {
                    "_id": "6239b3d1e05f770c37927329",
                    "product_name": "Semangka",
                    "product_grade": {
                        "_id": "623a5ebde6342137aa53339d",
                        "grade": "A",
                        "charge": 1000
                    },
                    "product_image": "http://localhost:5050/image/product/1647948753382.jpg",
                    "product_price": 8000,
                    "product_uom": "/kg"
                },
                "quantity": 1,
                "subTotal": 9000
            }
        ],
        "total": 51000,
        "createdAt": "2022-03-23T05:27:04.325Z",
        "updatedAt": "2022-03-23T05:51:51.639Z",
        "__v": 4
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
    "message": "Cart id: 623aafa8874bafa4efa0f154 updated",
    "result": {
        "_id": "623aafa8874bafa4efa0f154",
        "user": "6218bb4d03faab15554bb78b",
        "products": [
            {
                "productDetail": {
                    "_id": "6239b3d1e05f770c37927329",
                    "product_name": "Semangka",
                    "product_grade": {
                        "_id": "623a5ebde6342137aa53339d",
                        "grade": "A",
                        "charge": 1000
                    },
                    "product_image": "http://localhost:5050/image/product/1647948753382.jpg",
                    "product_price": 8000,
                    "product_uom": "/kg"
                },
                "quantity": 1,
                "subTotal": 9000
            }
        ],
        "total": 9000,
        "createdAt": "2022-03-23T05:27:04.325Z",
        "updatedAt": "2022-03-23T05:52:34.248Z",
        "__v": 4
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
    "message": "Cart id: 623aafa8874bafa4efa0f154 berhasil dihapus.",
    "result": {
        "_id": "623aafa8874bafa4efa0f154",
        "user": "6218bb4d03faab15554bb78b",
        "products": [],
        "total": 0,
        "createdAt": "2022-03-23T05:27:04.325Z",
        "updatedAt": "2022-03-23T05:53:34.235Z",
        "__v": 5
    }
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
    "message": "Moh Sarifudin carts",
    "result": {
        "_id": "623aafa8874bafa4efa0f154",
        "user": "6218bb4d03faab15554bb78b",
        "products": [
            {
                "productDetail": {
                    "_id": "6239b4f1e05f770c37927334",
                    "product_name": "Terong",
                    "product_grade": {
                        "_id": "623a5ee1e6342137aa5333a0",
                        "grade": "B",
                        "charge": 500
                    },
                    "product_image": "http://localhost:5050/image/product/1647949040996.jpg",
                    "product_price": 10000,
                    "product_uom": "/kg"
                },
                "quantity": 1,
                "subTotal": 10500
            }
        ],
        "total": 10500,
        "createdAt": "2022-03-23T05:27:04.325Z",
        "updatedAt": "2022-03-23T05:37:27.181Z",
        "__v": 3
    }
}
```