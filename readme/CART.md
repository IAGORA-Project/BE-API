# **API CART**

#### ***Base URL : http://api.iagora.id***

### Menampilkan Satu Pasar beserta productnya
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
    "status": 201,
    "message": "Cart berhasil ditambahkan",
    "result": {
        "_id": "6225664e0236231b8a1d5e29",
        "user": "6218bb4d03faab15554bb78b",
        "products": [
            {
                "product": {
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
                },
                "quantity": 1,
                "subTotal": 15000
            }
        ],
        "total": 15000,
        "createdAt": "2022-03-07T01:56:30.492Z",
        "updatedAt": "2022-03-07T01:56:30.492Z",
        "__v": 0
    }
}
```