# **API CHECKOUT**

#### ***Base URL : http://api.iagora.id***

### Melakukan checkout pembelian
**`URL : ${BaseURL}/api/v1/transaction/user/userId/checkout`**
```js
// AXIOS
const body = {
    "tip": 7000,
    "notes": [
        {
            "productId": "6239b4f1e05f770c37927334",
            "note": "Test note terong update."
        },
        {
            "productId": "6239b3d1e05f770c37927329",
            "note": "Test note semangka update."
        }
    ]
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
        "_id": "627f3e3581d329dd9eb56a96",
        "user": {
            "userDetail": {
                "checkoutAddress": {
                    "recipientName": "Steven",
                    "addressName": "Rumah Steven",
                    "fullAddress": "Jalan Steven, nomor 23",
                    "addressDetails": "Pagar hitam",
                    "phoneNumber": "6282132351252332",
                    "latitude": 73.46,
                    "longitude": 202.29
                },
                "name": "Harry Magguire2",
                "email": "harry2@emyu.com",
                "avatar": "http://localhost:5050/image/user/default.png",
                "addressHistories": [
                    {
                        "recipientName": "Steven",
                        "addressName": "Rumah Steven",
                        "fullAddress": "Jalan Steven, nomor 23",
                        "addressDetails": "Pagar hitam",
                        "phoneNumber": "6282132351252332",
                        "latitude": 73.46,
                        "longitude": 202.29,
                        "_id": "627e93fe479db39458684861"
                    }
                ]
            },
            "_id": "627e3140efd34cd44d3a691e",
            "no_hp": 6282133555115
        },
        "products": [
            {
                "productDetail": "627e60d2e3a006a9bddbd197",
                "subTotal": 15000,
                "note": "Test note pisang."
            }
        ],
        "tip": 5000,
        "total": 15000,
        "totalHandlingFee": 1500,
        "createdAt": "2022-05-14T05:29:25.517Z",
        "updatedAt": "2022-05-14T05:29:25.517Z",
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
        "_id": "627f3e3581d329dd9eb56a96",
        "user": {
            "userDetail": {
                "checkoutAddress": {
                    "recipientName": "Steven",
                    "addressName": "Rumah Steven",
                    "fullAddress": "Jalan Steven, nomor 23",
                    "addressDetails": "Pagar hitam",
                    "phoneNumber": "6282132351252332",
                    "latitude": 73.46,
                    "longitude": 202.29
                },
                "name": "Harry Magguire2",
                "email": "harry2@emyu.com",
                "avatar": "http://localhost:5050/image/user/default.png",
                "addressHistories": [
                    {
                        "recipientName": "Steven",
                        "addressName": "Rumah Steven",
                        "fullAddress": "Jalan Steven, nomor 23",
                        "addressDetails": "Pagar hitam",
                        "phoneNumber": "6282132351252332",
                        "latitude": 73.46,
                        "longitude": 202.29,
                        "_id": "627e93fe479db39458684861"
                    }
                ]
            },
            "_id": "627e3140efd34cd44d3a691e",
            "no_hp": 6282133555115
        },
        "products": [
            {
                "productDetail": {
                    "_id": "627e60d2e3a006a9bddbd197",
                    "product_name": "Pisang"
                },
                "subTotal": 15000,
                "note": "Test note pisang."
            }
        ],
        "tip": 5000,
        "total": 15000,
        "totalHandlingFee": 1500,
        "createdAt": "2022-05-14T05:29:25.517Z",
        "updatedAt": "2022-05-14T05:29:25.517Z",
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
