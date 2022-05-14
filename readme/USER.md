# **API USER**

#### ***Base URL : http://api.iagora.id***

### Access Token

Setiap endpoint user membutuhkan header x-access-token yang di dapat dari endpoint get-access-token. kecuali proses send otp dan verify otp.

**`URL : ${BaseURL}/api/v1/user/get-access-token`**

### Refresh Token

URL get access token membutuhkan header x-refresh-token yang di dapat dari proses verifikasi OTP

### Mendapatkan kode OTP di nomor WA
**`URL : ${BaseURL}/api/v1/user/send-otp-user`**
```js
// AXIOS
await axios.post(`${baseURL}/api/v1/user/send-otp-user`, {
  "no_hp": 6285241001993
}) // Kode OTP akan dikirim ke nomor WA jika terdaftar di WA

// Contoh response
{
    "status": 202,
    "message": "Segera verifikasi kode otp anda, akan expire dalam 1 menit",
    "result": null
}
```

### Verifikasi kode OTP
**`URL : ${BaseURL}/api/v1/user/verify-otp`**
```js
// AXIOS
await axios.post(`${baseURL}/api/v1/user/verify-otp`, {
  "no_hp": 6285241001993,
  "otp_code": "562087"
})

// Contoh response
{
    "status": 200,
    "message": "Varifikasi berhasil!",
    "result": {
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjBhNDZlNTg1MDVmNzU1M2U4NTZmNDAiLCJub19ocCI6IjYyODIxMTYxMDQwMTYiLCJpc3MiOiJodHRwOi8vaWFnb3JhLmlkIiwiYXVkIjoiaHR0cDovL2lhZ29yYS5pZCIsImlhdCI6MTY0NTQzNTM2MCwiZXhwIjoxNjQ4MDI3MzYwfQ.mF3TkBQzQL6fgWJXCmt3HMK86EMn4maeSgL_HpfWgKw"
    }
}
```

```text
Hasil response : 
    Hasil response dari verifikasi OTP akan menghasilkan refresh token. refresh token digunakan untuk mendapatkan access token agar user bisa melakukan transaksi, menambahkan produk ke dalam cart dll.
```

### Mendapatkan Access Token
**`URL : ${BaseURL}/api/v1/user/get-access-token`**
```js
// AXIOS
await axios.get(`${baseURL}/api/v1/user/get-access-token`, {
  headers: {
      'x-refresh-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjBhNDZlNTg1MDVmNzU1M2U4NTZmNDAiLCJub19ocCI6IjYyODIxMTYxMDQwMTYiLCJpc3MiOiJodHRwOi8vaWFnb3JhLmlkIiwiYXVkIjoiaHR0cDovL2lhZ29yYS5pZCIsImlhdCI6MTY0NTQzNTM2MCwiZXhwIjoxNjQ4MDI3MzYwfQ.mF3TkBQzQL6fgWJXCmt3HMK86EMn4maeSgL_HpfWgKw'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Access token akan expire dalam 24 jam.",
    "result": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8"
    }
}
```

### Melengkapi Data Registrasi User
**`URL : ${BaseURL}/api/v1/user/userId/complete-registration`**
```js
// AXIOS
const data = {
    name: 'Nama lengkap',
    email: 'contoh@gmail.com',
    address: 'Jl. aja dulu'
}
await axios.put(`${baseURL}/api/v1/user/6212f14598faa8e6e82d28de/complete-registration`, data, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Data anda berhasil dilengkapi.",
    "result": {
        "userDetail": {
            "name": "Moh. Sarifudin",
            "email": "syarif93@gmail.com",
            "address": "jl.aja dulu",
            "avatar": "1645436118444.jpg"
        },
        "_id": "6212f14598faa8e6e82d28de",
        "type": "User",
        "no_hp": 6285241001993,
        "transaction": [],
        "createdAt": "2022-02-21T01:56:21.895Z",
        "updatedAt": "2022-02-21T09:35:18.496Z",
        "__v": 0
    }
}
```

# Manage USER Data

**<details><summary>List Endpoint</summary>**
### **1. Get User Data**
Endpoint get user data membutuhkan header x-access-token yang di dapat dari endpoint get-access-token.

**`URL : ${BaseURL}/api/v1/user/get-data`**
```js
// AXIOS
await axios.get(`${baseURL}/api/v1/user/get-data`, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Success!",
    "result": {
        "userDetail": {
            "name": "Syarif",
            "email": "test@test.com",
            "address": "jl."
        },
        "_id": "6218bb4d03faab15554bb78b",
        "type": "User",
        "no_hp": 6282116104016,
        "transaction": [],
        "createdAt": "2022-02-25T11:19:41.546Z",
        "updatedAt": "2022-02-25T11:20:15.707Z",
        "__v": 0
    }
}
```
### **2. Update User Data**
Endpoint update user data membutuhkan header x-access-token yang di dapat dari endpoint get-access-token.

**`URL : ${BaseURL}/api/v1/user/update-data`**
```js
// Body dari setiap endpoint bersifat opsional, bisa hanya satu data atau lebih
// Contohnya isi body hanya satu data :
const data = {
    name: "Moh. Sarifudin"
}
// Contoh dua data :
const data = {
    name: "Moh. Sarifudin",
    email: "test@test.com"
}
// Contoh upload avatar
const formData = new FormData()
formData.append('avatar', avatarImage)


// AXIOS
await axios.put(`${baseURL}/api/v1/user/update-data`, data | formData , {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Success!",
    "result": {
        "userDetail": {
            "name": "Moh. Sarifudin",
            "email": "syarif93@gmail.com",
            "address": "jl. aja dulu",
            "avatar": "1646098312627.jpg"
        },
        "_id": "6218bb4d03faab15554bb78b",
        "type": "User",
        "no_hp": 6282116104016,
        "transaction": [],
        "createdAt": "2022-02-25T11:19:41.546Z",
        "updatedAt": "2022-03-01T01:31:52.669Z",
        "__v": 0
    }
}
```

### **3. Add User Address**
Endpoint add user address membutuhkan header x-access-token yang di dapat dari endpoint get-access-token.

**`URL : ${BaseURL}/api/v1/user/add-address`**
```js

// Contoh data :
const data = {
    "recipientName": "Odie",
    "addressName": "Rumah Odie",
    "fullAddress": "Jalan Utama, nomor 23",
    "addressDetails": "Pagar hitam",
    "phoneNumber": "6282133555115",
    "latitude": 53.46,
    "longitude": -2.29
}

// AXIOS
await axios.put(`${baseURL}/api/v1/user/add-address`, data | formData , {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Success!",
    "result": {
        "userDetail": {
            "checkoutAddress": null,
            "name": "Harry Magguire2",
            "email": "harry2@emyu.com",
            "address": "City of Manchester",
            "avatar": "http://api.iagora.id/image/user/default.png",
            "addressHistories": [
                {
                    "recipientName": "Steven",
                    "addressName": "Rumah Steven",
                    "fullAddress": "Jalan Steven, nomor 23",
                    "addressDetails": "Pagar hitam",
                    "phoneNumber": "6282132351252332",
                    "latitude": 73.46,
                    "longitude": 202.29,
                    "_id": "627f1f76ac21db2373cb8fc0"
                },
                {
                    "recipientName": "Odie",
                    "addressName": "Rumah Odie",
                    "fullAddress": "Jalan Utama, nomor 23",
                    "addressDetails": "Pagar hitam",
                    "phoneNumber": "6282133555115",
                    "latitude": 53.46,
                    "longitude": -2.29,
                    "_id": "627f236da4a7ecb8e7bad418"
                }
            ]
        },
        "_id": "627a54e7b510c0116d4abd7c",
        "type": "User",
        "no_hp": 6282133555115,
        "createdAt": "2022-05-10T12:04:55.593Z",
        "updatedAt": "2022-05-14T03:35:09.360Z",
        "__v": 3,
        "cart": "627e1644b510c0116d4ac167"
    }
}
```
  
Perlu di Note bahwa alamat masuk ke key addressHistories dan mendapatkan objectId per alamat.
  
### **4. Delete User Address**
Endpoint Delete user address membutuhkan header x-access-token yang di dapat dari endpoint get-access-token.

**`URL : ${BaseURL}/api/v1/user/delete-address`**
```js
// Menggunakan ObjectId untuk alamat yang akan dihapus sebagai acuan
// Contoh data :
const data = {
    "addressId": "627f1f76ac21db2373cb8fc0"
}

// AXIOS
await axios.delete(`${baseURL}/api/v1/user/add-address`, data | formData , {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Success!",
    "result": {
        "userDetail": {
            "checkoutAddress": null,
            "name": "Harry Magguire2",
            "email": "harry2@emyu.com",
            "address": "City of Manchester",
            "avatar": "http://api.iagora.id/image/user/default.png",
            "addressHistories": [
                {
                    "recipientName": "Odie",
                    "addressName": "Rumah Odie",
                    "fullAddress": "Jalan Utama, nomor 23",
                    "addressDetails": "Pagar hitam",
                    "phoneNumber": "6282133555115",
                    "latitude": 53.46,
                    "longitude": -2.29,
                    "_id": "627f236da4a7ecb8e7bad418"
                }
            ]
        },
        "_id": "627a54e7b510c0116d4abd7c",
        "type": "User",
        "no_hp": 6282133555115,
        "createdAt": "2022-05-10T12:04:55.593Z",
        "updatedAt": "2022-05-14T03:35:45.110Z",
        "__v": 3,
        "cart": "627e1644b510c0116d4ac167"
    }
}
```
  
Perlu di Note bahwa salah satu addressHistories terhapus.
  
### **5. Set Checkout Address**
Endpoint Set Checkout Address membutuhkan header x-access-token yang di dapat dari endpoint get-access-token.

**`URL : ${BaseURL}/api/v1/user/delete-address`**
```js
// Menggunakan ObjectId salah satu alamat sebagai acuan
// Contoh data :
const data = {
    "addressId": "627f236da4a7ecb8e7bad418"
}

// AXIOS
await axios.put(`${baseURL}/api/v1/user/add-address`, data | formData , {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Success!",
    "result": {
        "userDetail": {
            "checkoutAddress": {
                "recipientName": "Odie",
                "addressName": "Rumah Odie",
                "fullAddress": "Jalan Utama, nomor 23",
                "addressDetails": "Pagar hitam",
                "phoneNumber": "6282133555115",
                "latitude": 53.46,
                "longitude": -2.29
            },
            "name": "Harry Magguire2",
            "email": "harry2@emyu.com",
            "address": "City of Manchester",
            "avatar": "http://api.iagora.id/image/user/default.png",
            "addressHistories": [
                {
                    "recipientName": "Odie",
                    "addressName": "Rumah Odie",
                    "fullAddress": "Jalan Utama, nomor 23",
                    "addressDetails": "Pagar hitam",
                    "phoneNumber": "6282133555115",
                    "latitude": 53.46,
                    "longitude": -2.29,
                    "_id": "627f236da4a7ecb8e7bad418"
                }
            ]
        },
        "_id": "627a54e7b510c0116d4abd7c",
        "type": "User",
        "no_hp": 6282133555115,
        "createdAt": "2022-05-10T12:04:55.593Z",
        "updatedAt": "2022-05-14T03:36:16.297Z",
        "__v": 3,
        "cart": "627e1644b510c0116d4ac167"
    }
}
```
  
Perlu di Note key checkoutAddress telah terisi.

</details>
