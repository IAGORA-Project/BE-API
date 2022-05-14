# **API TRANSACTION**

#### ***Base URL : http://api.iagora.id***

### Melakukan submit transaction dari halaman checkout
**`URL : ${BaseURL}/api/v1/transaction/user/userId`**
```js
// AXIOS
const body = {
    "recipientAddress": "Jl. aja dulu",
    "shippingCosts": 4000,
    "paymentMethod": "BNI Transfer"
}

await axios.post(`${baseURL}/api/v1/transaction/user/625a5a9ee4b126105f064fbb`, body, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 201,
    "message": "Success",
    "result": {
        "user": "627e3140efd34cd44d3a691e",
        "products": [
            {
                "productDetail": "627e60d2e3a006a9bddbd197",
                "subTotal": 15000,
                "note": "Test note pisang."
            }
        ],
        "payment": {
            "paid": false
        },
        "paymentMethod": "BNI Transfer",
        "tip": 5000,
        "shippingCosts": 4000,
        "total": 15000,
        "totalHandlingFee": 1500,
        "recipientAddress": {
            "recipientName": "Steven",
            "addressName": "Rumah Steven",
            "fullAddress": "Jalan Steven, nomor 23",
            "addressDetails": "Pagar hitam",
            "phoneNumber": "6282132351252332",
            "latitude": 73.46,
            "longitude": 202.29
        },
        "_id": "627f3e3081d329dd9eb56a85",
        "createdAt": "2022-05-14T05:29:20.506Z",
        "updatedAt": "2022-05-14T05:29:20.506Z",
        "__v": 0
    }
}
```
