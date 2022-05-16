# **API WINGMAN**

#### ***Base URL : http://api.iagora.id***

### Access Token

Setiap endpoint user membutuhkan header x-access-token yang di dapat dari endpoint get-access-token. kecuali proses send otp dan verify otp.

**`URL : ${BaseURL}/api/v1/wingman/get-access-token`**

### Refresh Token

URL get access token membutuhkan header x-refresh-token yang di dapat dari proses verifikasi OTP

### Mendapatkan kode OTP di nomor WA
**`URL : ${BaseURL}/api/v1/wingman/send-otp-wingman`**
```js
// AXIOS
await axios.post(`${baseURL}/api/v1/wingman/send-otp-wingman`, {
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
**`URL : ${BaseURL}/api/v1/wingman/verify-otp`**
```js
// AXIOS
await axios.post(`${baseURL}/api/v1/wingman/verify-otp`, {
  "no_hp": 6285241001993,
  "otp_code": "562087"
})

// Contoh response
{
    "status": 200,
    "message": "Verifikasi berhasil!",
    "result": {
        "wingmanId": "621587db64c58b68ca659e0f",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjE1ODdkYjY0YzU4YjY4Y2E2NTllMGYiLCJub19ocCI6IjYyODIxMTYxMDQwMTYiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0IiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdCIsImlhdCI6MTY0NTU3ODIwMywiZXhwIjoxNjQ4MTcwMjAzfQ.jYTSsFlruF4wUJhVrtObr-qyzzUeghRVl-wZLjGZM7Q"
    }
}
```

```text
NB Hasil response : 
    Hasil response dari verifikasi OTP akan menghasilkan refresh token. refresh token digunakan untuk mendapatkan access token agar user bisa melakukan transaksi, menambahkan produk ke dalam cart dll.
```

### Mendapatkan Access Token
**`URL : ${BaseURL}/api/v1/wingman/get-access-token`**
```js
// AXIOS
await axios.get(`${baseURL}/api/v1/wingman/get-access-token`, {
  headers: {
      'x-refresh-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjBhNDZlNTg1MDVmNzU1M2U4NTZmNDAiLCJub19ocCI6IjYyODIxMTYxMDQwMTYiLCJpc3MiOiJodHRwOi8vaWFnb3JhLmlkIiwiYXVkIjoiaHR0cDovL2lhZ29yYS5pZCIsImlhdCI6MTY0NTQzNTM2MCwiZXhwIjoxNjQ4MDI3MzYwfQ.mF3TkBQzQL6fgWJXCmt3HMK86EMn4maeSgL_HpfWgKw'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Access token akan expire dalam 24 jam.",
    "result": {
        "wingmanId": "621587db64c58b68ca659e0f",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8"
    }
}
```

### Melengkapi Data Wingman Detail
**`URL : ${BaseURL}/api/v1/wingman/wingmanId/complate-wingman-detail`**
```js
// AXIOS
const data = {
    "name": "Moh. Sarifudin",
    "email": "moh.syarif93@gmail.com",
    "address": "jl. aja dulu",
    "city": "Buol"
}
await axios.put(`${baseURL}/api/v1/wingman/wingmanId/complate-wingman-detail`, data, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Detail wingman berhasil di update.",
    "result": {
        "wingmanDetail": {
            "name": "Moh. Sarifudin",
            "email": "moh.syarif93@gmail.com",
            "address": "jl. aja dulu",
            "city": "Buol"
        },
        "_id": "621587db64c58b68ca659e0f",
        "type": "Wingman",
        "no_hp": "6282116104016",
        "on_process": [],
        "kotak_saran": [],
        "createdAt": "2022-02-23T01:03:23.814Z",
        "updatedAt": "2022-02-23T04:41:31.545Z",
        "__v": 0
    }
}
```

### Melengkapi Data Wingman Document
**`URL : ${BaseURL}/api/v1/wingman/wingmanId/complate-wingman-document`**
```js
// AXIOS
const formData = new formData()
formData.append('ktp', gambarKTP)
formData.append('skck', gambarSKCK)
formData.append('bank', 'BCA')
formData.append('no_rek', 123)
formData.append('nama_rek', 'Nama pengguna')
await axios.put(`${baseURL}/api/v1/wingman/wingmanId/complate-wingman-detail`, formData, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "message": "Detail wingman berhasil di update.",
    "result": {
        "wingmanDetail": {
            "name": "Moh. Sarifudin",
            "email": "moh.syarif93@gmail.com",
            "address": "jl. aja dulu",
            "city": "Buol"
        },
        "_id": "621587db64c58b68ca659e0f",
        "type": "Wingman",
        "no_hp": "6282116104016",
        "on_process": [],
        "kotak_saran": [],
        "createdAt": "2022-02-23T01:03:23.814Z",
        "updatedAt": "2022-02-23T04:41:31.545Z",
        "__v": 0
    }
}
```

### Menampilkan data gambar document
```text
NB Gambar document : 
    Gambar document bisa di ambil dengan menggunakan url.
```
**`URL : ${BaseURL}/image/wingman/wingmanId/document/data-gambar-dari-database.png`**

contoh: **`URL : ${BaseURL}/image/wingman/621587db64c58b68ca659e0f/document/1645597463225.png`**


### Menghapus Satu Akun Wingman
**`URL : ${BaseURL}/api/v1/wingman/wingmanId/delete-one-wingman`**

Perlu dicatat bahwa wingmanId pada params dan token harus sama.

```js
// AXIOS
await axios.delete(`${baseURL}/api/v1/wingman/627e3345efd34cd44d3a6933/delete-one-wingman`, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 200,
    "code": "SS200",
    "message": "Success Delete One Wingman"
}

```

# Wingman Request Pembukaan Pasar Baru dan Penambahan Product Baru

**<details><summary>List Endpoint</summary>**
### **1. Request Pembukaan Pasar Baru**
Endpoint pembukaan pasar baru membutuhkan header x-access-token yang di dapat dari endpoint get-access-token.

**`URL : ${BaseURL}/api/v1/wingman/request-new-market`**
```js
// AXIOS
const data = {
    "name": "Pasar tradisional buol",
    "address": "JL",
    "cityId": "6222f56b6d52dbb0b86d85c9"
}

await axios.post(`${baseURL}/api/v1/wingman/request-new-market`, data, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 201,
    "message": "Success.",
    "result": {
        "name": "Pasar Kranggan",
        "address": "jl Poncowinatan",
        "city": {
            "_id": "622368cb590c828bdc217e73",
            "name": "Yogyakarta",
            "markets": [
                "627f52f6551f949941838291"
            ],
            "createdAt": "2022-03-05T13:42:35.126Z",
            "updatedAt": "2022-05-14T06:57:58.915Z",
            "__v": 1
        },
        "products": [],
        "isAccept": true,
        "_id": "627f52f6551f949941838291",
        "createdAt": "2022-05-14T06:57:58.908Z",
        "updatedAt": "2022-05-14T06:57:58.908Z",
        "__v": 0
    }
}
```

### **2. Request Penambahan Product Baru**
Endpoint pembuatan product baru membutuhkan header x-access-token yang di dapat dari endpoint get-access-token.

**`URL : ${BaseURL}/api/v1/wingman/request-new-product`**
```js
// AXIOS
const formData = new formData()
formData.append('product_name', 'Pisang')
formData.append('product_category', 'Buah')
formData.append('product_grade', 'A')
formData.append('product_image', gambarProduct)
formData.append('product_price', "15000")
formData.append('product_uom', "/sisir")
formData.append('marketId', "622342ee9ec09bf428b4dbcb")
await axios.post(`${baseURL}/api/v1/wingman/request-new-product`, formData, {
  headers: {
      'x-access-token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjEyZjE0NTk4ZmFhOGU2ZTgyZDI4ZGUiLCJub19ocCI6NjI4MjExNjEwNDAxNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJpYXQiOjE2NDU0MzU4NDgsImV4cCI6MTY0NTUyMjI0OH0.yMha3e80dQDPlvw_2Ou6hA3XyNAcBjlZzEF_meo42l8'
  }
})

// Contoh response
{
    "status": 201,
    "message": "Success.",
    "result": {
        "product_name": "Pisang",
        "product_category": "6239cfbaf75d0a193b5fb501",
        "product_grade": "623ab81f1f1dcb714e7cc18f",
        "product_image": "1652512322018.jpg",
        "product_price": 15000,
        "product_uom": "sisir",
        "market": "627f52f6551f949941838291",
        "isAccept": true,
        "_id": "627f5642551f949941838299",
        "createdAt": "2022-05-14T07:12:02.061Z",
        "updatedAt": "2022-05-14T07:12:02.061Z",
        "__v": 0
    }
}
```
</details>
