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
        "user": "625a5a9ee4b126105f064fbb",
        "products": [
            {
                "productDetail": "6239b4f1e05f770c37927334",
                "subTotal": 15000,
                "note": ""
            }
        ],
        "payment": {
            "paid": false
        },
        "paymentMethod": "BNI Transfer",
        "tip": 0,
        "shippingCosts": 4000,
        "total": 15000,
        "totalHandlingFee": 750,
        "recipientAddress": "Jl. aja dulu",
        "_id": "6268e58d632740bf55b81c78",
        "createdAt": "2022-04-27T06:41:17.985Z",
        "updatedAt": "2022-04-27T06:41:17.985Z",
        "__v": 0
    }
}
```