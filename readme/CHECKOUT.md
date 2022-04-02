# **API CHECKOUT**

#### ***Base URL : http://api.iagora.id***

### Melakukan checkout pembelian
**`URL : ${BaseURL}/api/v1/transaction/user/userId/checkout`**
```js
// AXIOS
const body = {
    "tip": 1000,
    "recipientAddress": "Jl. dulu",
    "shippingCost": 8000
}
await axios.post(`${baseURL}/api/v1/transaction/user/6218bb4d03faab15554bb78b/checkout`, body, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 201,
    "message": "Success",
    "result": {
        "user": "6218bb4d03faab15554bb78b",
        "products": [
            {
                "productDetail": "6239b3d1e05f770c37927329",
                "subTotal": 8000
            }
        ],
        "recipientAddress": "Jl. dulu",
        "tip": 1000,
        "total": 8000,
        "shippingCost": 8000,
        "totalHandlingFee": 1000,
        "_id": "6247fc68ea39dcd749b09d89",
        "createdAt": "2022-04-02T07:34:00.919Z",
        "updatedAt": "2022-04-02T07:34:00.919Z",
        "__v": 0
    }
}
```

### Mengambil data checkout
**`URL : ${BaseURL}/api/v1/transaction/user/userId/checkout`**
```js
// AXIOS
await axios.get(`${baseURL}/api/v1/transaction/user/6218bb4d03faab15554bb78b/checkout`, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Success",
    "result": {
        "_id": "6247fc68ea39dcd749b09d89",
        "user": "6218bb4d03faab15554bb78b",
        "products": [
            {
                "productDetail": "6239b3d1e05f770c37927329",
                "subTotal": 8000
            }
        ],
        "recipientAddress": "Jl. dulu",
        "tip": 1000,
        "total": 8000,
        "shippingCost": 8000,
        "totalHandlingFee": 1000,
        "createdAt": "2022-04-02T07:34:00.919Z",
        "updatedAt": "2022-04-02T07:34:00.919Z",
        "__v": 0
    }
}
```

### Membatalkan checkout
**`URL : ${BaseURL}/api/v1/transaction/user/userId/checkout/cancel`**
```js
// AXIOS
await axios.delete(`${baseURL}/api/v1/transaction/user/6218bb4d03faab15554bb78b/checkout/cancel`, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 202,
    "message": "Checkout berhasil di batalkan.",
    "result": null
}
```