# **API WINGMAN**

#### ***Base URL : http://iagora.id***

### Access Token

Setiap endpoint user membutuhkan header x-access-token yang di dapat dari endpoint get-access-token. kecuali proses send otp dan verify otp.

**`URL : ${BaseURL}/api/v1/wingman/wingmanId/get-access-token`**

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
**`URL : ${BaseURL}/api/v1/wingman/wingmanId/get-access-token`**
```js
// AXIOS
await axios.get(`${baseURL}/api/v1/wingman/621587db64c58b68ca659e0f/get-access-token`, {
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