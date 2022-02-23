# **API USER**

#### ***Base URL : http://iagora.id***

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