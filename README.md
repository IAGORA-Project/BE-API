# **Api Endpoint**

#### ***Base URL : http://iagora.id***

Setiap Request Endpoint Wingman, User, Product, Chating, dll Membutuhkan Headers `sessid`. Headers Tersebut Didapat Dari :

```js
/* WITH NODE-FETCH */

const fetch = require('node-fetch');

const sessid = await fetch(`${BaseURL}/api/v1/auth/get-token`, {
    headers: {
        auth: 'ini rahasia'
    }
})
console.log(sessid.headers.get('sessid')) // jPBI7pczvwGVgpJT6rlj9AOU2pHn81

/* WITH AXIOS */

const { default: Axios } = require('axios');

const sessid = await Axios.get(`${BaseURL}/api/v1/auth/get-token`, {
    headers: {
        auth: 'ini rahasia'
    }
})
console.log(sessid.headers.sessid)
```

##### *Defined in <a href="https://github.com/IAGORA-Project/BE-API/blob/main/router/token.js#L12">router/token.js:12</a>*

# Endpoint WINGMAN

***Total 14***

**<details><summary>List Endpoint</summary>**

##### *Defined in <a href="https://github.com/IAGORA-Project/BE-API/blob/main/router/wingman/router_wingman.js">router/wingman/router_wingman.js</a>*

### **1. Pendaftaran (Input No HP)**

Mengirimkan OTP Ke Nomer WhatsApp Target Menggunakan [WA-API](https://github.com/IAGORA-Project/WA-API)

**`URL : ${BaseURL}/api/v1/wingman/send-otp-wingman`**

<center><img src="imageMD/img_1.png" height="200"></center>

**METHOD : POST**

***BODY (no_hp) :***

```js
{
    "no_hp": "6287715579966"
}
```

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi" // Random String From /api/v1/auth/get-token
}
```

***EXAMPLE REQUEST NODE JS :***

```js

const fetch = require('node-fetch');

const send = await fetch(`${BaseURL}/api/v1/wingman/send-otp-wingman`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
        "no_hp": "6287715579966",
    }),
    headers: {
        'Accept': "application/json",
        'Content-Type': 'application/json',
        'sessid': sessid.headers.get('sessid'),
    },
})
```

### **2. Input OTP**

Login Wingman Dengan Menggunakan OTP, Jika Wingman Belum terdaftar Otomatis akan Dibuat Data `null` pada Beberapa Field DB. Untuk Mengisinya/Push DB Gunakan Endpoint `/register-wingman`

**`URL : ${BaseURL}/api/v1/wingman/login-wingman`**

<center><img src="imageMD/img_2.png" width="200"></center>

**METHOD : POST**

***BODY (no_np, otp) :***

```js
{
    "no_hp": "6287715579966",
    "otp": "123456" // Random Numbers From WhatsApp
}
```

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

### **3. SUBMIT & PREVIEW IMAGE WINGMAN**

Data Submit Wingman Sementara Disimpan Didalam JSON, Gunakan Endpoint `/api/v1/wingman/register-wingman` Untuk Push JSON ke MongoDB (Pastikan Sudah Login). Pada Endpoint ini Juga Upload KTP & SKCK Wingman.

**`URL : ${BaseURL}/api/v1/upload/wingman/submit-data`**

<center><img src="imageMD/img_3.png" width="200"></center>

**METHOD : POST**

***BODY : (nama, email, alamat, kota, pasar, bank, no_rek, nama_rek)***

```js
{
    "nama": "Udin",
    "email": "udin@email.com",
    "alamat": "Jln pattimura",
    "kota": "Balikpapan",
    "pasar": "Rawa-Indah",
    "bank": "BRI",
    "no_rek": "123456789101112",
    "nama_rek": "Udin Sukamaju",
}
```

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", // Cookie JWT Dari Login
    "client-type": "wingman" // Karena Endpoint Ini Akan Diakses Oleh Wingman
}
```

***EXAMPLE REQUEST NODE JS :***

```js

const { default: Axios } = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');

const fd = new FormData();
fd.append('nama', 'Udin');
fd.append('email', 'udin@email.com');
fd.append('alamat', 'Jln pattimura');
fd.append('kota', 'Balikpapan');
fd.append('pasar', 'Rawa-Indah');
fd.append('bank', 'BRI');
fd.append('no_rek', '123456789101112');
fd.append('nama_rek', 'Udin Sukamaju');
fd.append('file', fs.createReadStream('./image/ktp_example.png')); // Upload KTP
fd.append('file', fs.createReadStream('./image/skck_example.png')); // Upload SKCK
Axios({
        method: 'POST',
        withCredentials: true,
        url: `${BaseURL}/api/v1/upload/wingman/submit-data`,
        data: fd,
        headers: {  
            'content-type': `multipart/form-data; boundary=${fd._boundary}`,
            'cookie': 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjdlZWIxZGM4OTYzODA1NWVhZmVmOCIsImlhdCI6MTY0MzYzODQ5NSwiZXhwIjoxNjQzNjQyMDk1fQ.W2az25O7a2AvoUAZvkQdgADkj136HlqnO3T3xxWt61Q',
            'sessid': sessid.headers.get('sessid'),
            'client-type': 'wingman',
        }
})
```
Adapun Response Yang Diberikan Digunakan Sebagai Preview Data JSON Sebelum di Push ke MonggoDB

<center><img src="imageMD/img_4.png" width="200"></center>


### **4. REGISTRASI PUSH DB WINGMAN**

Memperbarui Data `null` Saat Login Dan Mengganti Dengan Apa Yang sudah d Submit (Pastikan Sudah Submit Mengakses Endpoint No 3 Diatas)

**`URL : ${BaseURL}/api/v1/wingman/register-wingman`**

**`NO IMG`**

**METHOD : GET**

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "wingman" 
}
```


### **5. GET/CHECK DATA WINGMAN**

Melihat Data Wingman Yang Tersimpan di MongoDB (Pastikan Sudah Login)

**`URL : ${BaseURL}/api/v1/wingman/wingman-data`**

<center><img src="imageMD/img_5.png" width="200"></center>

**METHOD : GET**

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "wingman" 
}
```

***EXAMPLE REQUEST NODE JS :***

```js

const fetch = require('node-fetch');

const get = await fetch(`${BaseURL}/api/v1/wingman/wingman-data`, {
    credentials: "include",
    headers: {
        'client-type': 'wingman',
        'sessid': sessid.headers.get('sessid'),
        'cookie': 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjdlZWIxZGM4OTYzODA1NWVhZmVmOCIsImlhdCI6MTY0MzYzODQ5NSwiZXhwIjoxNjQzNjQyMDk1fQ.W2az25O7a2AvoUAZvkQdgADkj136HlqnO3T3xxWt61Q',
    },
})

return get.json()
```

### **6. INPUT PIN WINGMAN**

Input PIN Wingman. PIN Digunakan Untuk Login Kembali Jika JWT Expired / Bukan Logout

**`URL : ${BaseURL}/api/v1/wingman/input-pin`**

**`NO IMG`**

**METHOD : POST**

***BODY : (pin)***

```js
{
    "pin": "1234" // PIN 4 Digit
}
```

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "wingman" 
}
```

### **7. MENGGANTI DATA WINGMAN**

Endpoint ini Hanya Mengganti Apa Yang Sudah di Submit Wingman (Pastikan Sudah Login)

**`URL : ${BaseURL}/api/v1/wingman/change-data-wingman`**

**`NO IMG`**

**METHOD : POST**

***BODY : (nama, email, alamat, kota, pasar, bank, no_rek, nama_rek)***

```js
{
    "nama": "Udin",
    "email": "udin123@email.com",
    "alamat": "Jln Soedirman",
    "kota": "Balikpapan",
    "pasar": "Rawa-Indah",
    "bank": "MANDIRI",
    "no_rek": "09876543210987",
    "nama_rek": "Udin Sukamaju",
}
```
**`NB: Body Tidak Harus Diisi Semua, Bisa Salah Satu Saja Yang Ingin Di Perbarui`**

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "wingman" 
}
```

### **8. MENGGANTI STATUS LAYANAN**

Mengubah Status Layanan/Available (Pastikan Sudah Login)

**`URL : ${BaseURL}/api/v1/wingman/switch-available`**

**`Image NO. 5`**

**METHOD : GET**

***QUERY : (status_available: Boolean)***

`${BaseURL}/api/v1/wingman/switch-available/?status_available=false`

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "wingman" 
}
```

### **9. MENGGANTI JUMLAH ORDERAN**

Mengubah Jumlah Orderan Wingman, Today Order & Total Order (Pastikan Sudah Login)

Today Order
**`URL : ${BaseURL}/api/v1/wingman/edit-today-order`**

Total Order
**`URL : ${BaseURL}/api/v1/wingman/edit-total-order`**

**`Image NO. 5`**

**METHOD : POST**

***PARAMS : (action: add / reset)***

`${BaseURL}/api/v1/wingman/edit-today-order/add`
Atau
`${BaseURL}/api/v1/wingman/edit-today-order/reset`
***BODY : (added)***

```js
{
    "added": 1,
}

// Atau Mines
{
    "added": -1,
}

```

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "wingman" 
}
```

### **10. LOGOUT WINGMAN**

Logout Wingman

**`URL : ${BaseURL}/api/v1/wingman/logout-wingman`**

**`NO IMG`**

**METHOD : GET**

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "wingman" 
}
```

### **11. LOGIN WITH PIN WINGMAN**

Login Wingman Dengan Menggunakan PIN Yang Telah Di Input Pada Endpoint **`/api/v1/wingman/input-pin`**

**`URL : ${BaseURL}/api/v1/wingman/enter-pin`**

**`NO IMG`**

**METHOD : POST**

***BODY (no_np, pin) :***

```js
{
    "no_hp": "6287715579966",
    "pin": "1234" // PIN 4 Digit
}
```

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

### **12. DELETE NULL WINGMAN**

Menghapus Document Wingman Dengan Status `null`/Belum Push MongoDB + Menghapus Data JSONnya Jika Pernah Submit Data dan Belum Push MongoDB (GET Register)

**`URL : ${BaseURL}/api/v1/wingman/delete-submit`**

**`NO IMG`**

**METHOD : POST**

***BODY (no_hp) :***
```js
{
    "no_hp": "6287715579966",
}
```

***HEADERS (sessid) :***
```js
headers: {
    "sessid": "abcdefghi",
}
```

### **13. DELETE WINGMAN**

Menghapus Document Wingman Dengan Status **tidak** `null`/Sudah Push MongoDB

**`URL : ${BaseURL}/api/v1/wingman/delete-wingman`**

**`NO IMG`**

**METHOD : POST**

***BODY (no_hp) :***
```js
{
    "no_hp": "6287715579966",
}
```

***HEADERS (sessid) :***
```js
headers: {
    "sessid": "abcdefghi",
}
```

### **14. DELETE ALL WINGMAN**

Menghapus Semua Document Wingman di MongoDB

**`URL : ${BaseURL}/api/v1/wingman/delete-all-wingman`**

**`NO IMG`**

**METHOD : GET**

***HEADERS (sessid) :***
```js
headers: {
    "sessid": "abcdefghi",
}
```

---

</details>

# Endpoint USER

***Total 9***

**<details><summary>List Endpoint</summary>**

##### *Defined in <a href="https://github.com/IAGORA-Project/BE-API/blob/main/router/user/router_user.js">router/user/router_user.js</a>*

### **1. SEND OTP USER**

Mengirimkan OTP Ke Nomer WhatsApp Target User Menggunakan [WA-API](https://github.com/IAGORA-Project/WA-API)

**`URL : ${BaseURL}/api/v1/user/send-otp-user`**

**`NO IMG`**

**METHOD : POST**

***BODY (no_hp) :***

```js
{
    "no_hp": "6287715579966"
}
```

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi" // Random String From /api/v1/auth/get-token
}
```

***EXAMPLE REQUEST NODE JS :***

```js
const fetch = require('node-fetch');

const send = await fetch(`${BaseURL}/api/v1/user/send-otp-user`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
        "no_hp": "6287715579966",
    }),
    headers: {
        'Accept': "application/json",
        'Content-Type': 'application/json',
        'sessid': sessid.headers.get('sessid'),
    },
})
```

### **2. LOGIN OTP USER**

Login User Menggunakan OTP, Jika Belum Terdaftar Otomatis Dibuatkan Field Data `null`

**`URL : ${BaseURL}/api/v1/user/login-user`**

**`NO IMG`**

**METHOD : POST**

***BODY (no_np, otp) :***

```js
{
    "no_hp": "6287715579966",
    "otp": "123456" // Random Numbers From WhatsApp
}
```

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

### **3. REGISTER USER**

Memperbarui Data `null` Saat Login Dan Mengganti Dengan Apa Yang sudah di Submit di body

**`URL : ${BaseURL}/api/v1/user/register-user`**

**`NO IMG`**

**METHOD : POST**

***BODY (nama, alamat, email) :***

```js
{
    "nama": "Bambang",
    "alamat": "Jl Sudirman",
    "email": "bambang@email.com"
}
```

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "user" 
}
```

### **4. INPUT PIN USER**

Input PIN Yang Digunakan Untuk Login PIN

**`URL : ${BaseURL}/api/v1/user/input-pin`**

**`NO IMG`**

**METHOD : POST**

***BODY (pin) :***

```js
{
    "pin": "1234", // PIN 4 Digit
}
```

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "user" 
}
```


### **5. CHECK DATA USER**

Check Data User di MongoDB

**`URL : ${BaseURL}/api/v1/user/user-data`**

**`NO IMG`**

**METHOD : GET**

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "user" 
}
```

***EXAMPLE REQUEST NODE JS :***

```js
const fetch = require('node-fetch');

const get = await fetch(`${BaseURL}/api/v1/user/user-data`, {
    credentials: "include",
    headers: {
        'client-type': 'user',
        'sessid': sessid.headers.get('sessid'),
        'cookie': 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjdlZWIxZGM4OTYzODA1NWVhZmVmOCIsImlhdCI6MTY0MzYzODQ5NSwiZXhwIjoxNjQzNjQyMDk1fQ.W2az25O7a2AvoUAZvkQdgADkj136HlqnO3T3xxWt61Q',
    },
})

return get.json()
```

### **6. MENGGANTI DATA USER**

Endpoint ini Hanya Mengganti Apa Yang Ada di body (Pastikan Sudah Login)

**`URL : ${BaseURL}/api/v1/user/change-data-user`**

**`NO IMG`**

**METHOD : POST**

***BODY (nama, alamat, email) :***

```js
{
    "nama": "Budi",
    "alamat": "Jl MT Haryono",
    "email": "budi@email.com"
}
```
**`NB: Body Tidak Harus Diisi Semua, Bisa Salah Satu Saja Yang Ingin Di Perbarui`**

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "user" 
}
```


### **7. LOGOUT USER**

Logout User

**`URL : ${BaseURL}/api/v1/user/logout-user`**

**`NO IMG`**

**METHOD : GET**

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "user" 
}
```

### **8. DELETE USER**

Menghapus Document User Yang Null dan Sudah Register User

**`URL : ${BaseURL}/api/v1/user/delete-user`**

**`NO IMG`**

**METHOD : POST**

***BODY (nama, alamat, email) :***

```js
{
    "no_hp": "6287715579966",
}
```

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

### **9. DELETE ALL USER**

Menghapus Semua Document User Yang Tersimpan

**`URL : ${BaseURL}/api/v1/user/delete-all-user`**

**`NO IMG`**

**METHOD : GET**

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```
---

</details>

# Endpoint UPLOAD FILE

***Total 3***

**<details><summary>List Endpoint</summary>**

##### *Defined in <a href="https://github.com/IAGORA-Project/BE-API/blob/main/router/upload/router_upload.js">router/upload/router_upload.js</a>*

Upload File Menggunakan Multer, Semua File Tersimpan Didalam Folder public/file

### **1. UPLOAD PROFILE IMAGE WINGMAN**

Upload Image Wingman ke Folder Public dan return Data HEX, ubah ke base64 jika Ingin di Tampilkan

**`URL : ${BaseURL}/api/v1/upload/wingman/profile`**

**`NO IMG`**

**METHOD : POST**

***BODY (file) :***

`file : multipart/form-data`

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "wingman" 
}
```
***EXAMPLE REQUEST NODE JS :***

```js
const FormData = require('form-data');
const { default: Axios } = require('axios');
const fs = require('fs-extra');

const fd = new FormData()
fd.append('file', fs.createReadStream('./image/profile_wingman_example.png'))
Axios({
        method: 'POST',
        withCredentials: true,
        url: `${BaseURL}/api/v1/upload/wingman/profile`,
        data: fd,
        headers: {  
            'content-type': `multipart/form-data; boundary=${fd._boundary}`,
            'client-type': 'wingman',
            'cookie': 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjdlZWIxZGM4OTYzODA1NWVhZmVmOCIsImlhdCI6MTY0MzYzODQ5NSwiZXhwIjoxNjQzNjQyMDk1fQ.W2az25O7a2AvoUAZvkQdgADkj136HlqnO3T3xxWt61Q', 
            'sessid': sessid.headers.get('sessid'),
        },
})
```

### **2. UPLOAD PROFILE IMAGE USER**

Upload Image User ke Folder Public dan return Data HEX, ubah ke base64 jika Ingin di Tampilkan

**`URL : ${BaseURL}/api/v1/upload/user/profile`**

**`NO IMG`**

**METHOD : POST**

***BODY (file) :***

`file : multipart/form-data`

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "user" 
}
```
### **3. UPLOAD PROFILE IMAGE ADMIN**

Upload Image Admin ke Folder Public dan return Data HEX, ubah ke base64 jika Ingin di Tampilkan

**`URL : ${BaseURL}/api/v1/upload/admin/profile`**

**`NO IMG`**

**METHOD : POST**

***BODY (file) :***

`file : multipart/form-data`

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "admin",
    "auths": "iagoraid"
}
```

---

</details>

# Endpoint CHATING

***Total 8***

**<details><summary>List Endpoint</summary>**

##### *Defined in <a href="https://github.com/IAGORA-Project/BE-API/blob/main/lib/chat/router/router_chat.js#L24">lib/chat/router/router_chat.js:24</a>*

### **1. CREATE ROOM UNTUK 2 ORANG**

Membuat Room Chat untuk 2 Orang

**`URL : ${BaseURL}/api/v1/chat/create`**

<center><img src="imageMD/img_6.png" width="200"></center>

**METHOD : GET**

***PARAMS (ID User & ID Wingman) :***

`${BaseURL}/api/v1/chat/create/61f607818e9e9b9583ed5d1c/61f616188e9e9b9583ed5d56`

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

### **2. SEND MESSAGE KE ROOM**

Mengirimkan Pesan Ke Sebuah Room Chat

**`URL : ${BaseURL}/api/v1/chat/msg`**

<center><img src="imageMD/img_7.png" width="200"></center>

**METHOD : POST**

***PARAMS (Room & ID Pengirim) :***

`${BaseURL}/api/v1/chat/msg/61f62af47091d40478298a9c/61f607818e9e9b9583ed5d1c`

***BODY (Message) :***

```js
{
    "message": "ok thank you gann"
}
```

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

***EXAMPLE REQUEST NODE JS :***

```js
const fetch = require('node-fetch');

const get = await fetch(`${BaseURL}/api/v1/chat/msg/${room_id}/${pengirim_id}`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
        "message": "ok thank you gann",
    }),
    headers: {
        'Accept': "application/json",
        'Content-Type': 'application/json',
        'sessid': sessid.headers.get('sessid'),
    },
})

return get.json()
```

### **3. SEND IMAGE/FILE MESSAGE**

Mengirim pesan gambar/file

**`URL : ${BaseURL}/api/v1/upload/chat/file`**

**`NO IMG`**

**METHOD : POST**

***BODY (file) :***

`file : multipart/form-data`

***PARAMS (Room & ID Pengirim) + QUERY (text)***

`${BaseURL}/api/v1/upload/chat/file/61f62af47091d40478298a9c/61f616188e9e9b9583ed5d56/?text=halo halo`

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

***EXAMPLE REQUEST NODE JS :***

```js
const FormData = require('form-data');
const { default: Axios } = require('axios');
const fs = require('fs-extra');

const fd = new FormData()
fd.append('file', fs.createReadStream('./image/message_image_example.png'))
Axios({
        method: 'POST',
        withCredentials: true,
        url: `${BaseURL}/api/v1/upload/chat/file/${room_id}/${pengirim_id}/?text=${message}`,
        data: fd,
        headers: {  
            'content-type': `multipart/form-data; boundary=${fd._boundary}`,
            'sessid': sessid.headers.get('sessid'),
        },
})
```

### **4. GET ALL MESSAGE ROOM**

Melihat Semua Pesan Yang ada Di Dalam Sebuah Room Chat (History Chat)

**`URL : ${BaseURL}/api/v1/chat/get-msg-room`**

**`NO IMG`**

**METHOD : GET**

***PARAMS (Room) :***

`${BaseURL}/api/v1/chat/get-msg-room/61f62af47091d40478298a9c`

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

### **5. DELETE MESSAGE**

Menghapus Sebuah Pesan Dari id message

**`URL : ${BaseURL}/api/v1/chat/delete-msg`**

**`NO IMG`**

**METHOD : GET**

***PARAMS (ID Message & Room) :***

`${BaseURL}/api/v1/chat/delete-msg/61f62bfb7091d40478298aa7/61f62af47091d40478298a9c`

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

### **6. MESSAGE TELAH TERBACA**

Menandai Bahwa Pesan Telah Terbaca

**`URL : ${BaseURL}/api/v1/chat/read-msg`**

**`NO IMG`**

**METHOD : GET**

***PARAMS (ID Message) :***

`${BaseURL}/api/v1/chat/read-msg/61f607818e9e9b9583ed5d1c`

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

### **7. GET SEMUA ROOM DI DB**

Melihat Semua Room di DB

**`URL : ${BaseURL}/api/v1/chat/all-room`**

**`NO IMG`**

**METHOD : GET**

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

### **8. DELETE ONE ROOM DI DB**

Menghapus Satu Room di DB

**`URL : ${BaseURL}/api/v1/chat/delete-room`**

**`NO IMG`**

**METHOD : GET**

***PARAMS (ID Message) :***

`${BaseURL}/api/v1/chat/delete-room/61f104cfd0cfa4c4309e788c`

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

---

</details>

# Endpoint PRODUCT

***Total 6***

**<details><summary>List Endpoint</summary>**

##### *Defined in <a href="https://github.com/IAGORA-Project/BE-API/blob/main/router/product/router_product.js">router/product/router_product.js</a>*

### **1. CREATE PRODUCT**

Membuat Product Baru dan Disimpan di dalam MongoDB

**`URL : ${BaseURL}/api/v1/product/create-product`**

**`NO IMG`**

**METHOD : POST**

***BODY (product_name, product_category, product_grade, product_image, product_price, product_uom) :***

```js
{
    "product_name": "Semangka",
    "product_category": "buah",
    "product_grade": "A",
    "product_image": "IMAGE BASE 64",
    "product_price": "6000",
    "product_uom": "/kg",
}
```
***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

### **2. UPDATE SUATU PRODUCT**

Mengupdate Suatu Product dari Id Product

**`URL : ${BaseURL}/api/v1/product/update-product`**

**`NO IMG`**

**METHOD : POST**

***PARAMS (ID Product) :***

`${BaseURL}/api/v1/product/update-product/61f6333dcce79fb36b67ac69`

***BODY (product_name, product_category, product_grade, product_image, product_price, product_uom) :***

```js
{
    "product_name": "Semangka",
    "product_category": "buah",
    "product_grade": "A",
    "product_image": "IMAGE BASE 64",
    "product_price": "6000",
    "product_uom": "/kg",
}
```
**`NB: Body Tidak Harus Diisi Semua, Bisa Salah Satu Saja Yang Ingin Di Perbarui`**

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

### **3. MELIHAT SATU PRODUCT**

Read 1 Product di MongoDB dari id nya

**`URL : ${BaseURL}/api/v1/product/read-one-product`**

<center><img src="imageMD/img_9.png" width="200"></center>

**METHOD : GET**

***PARAMS (ID Product) :***

`${BaseURL}/api/v1/product/read-one-product/61e262aae6b1e7d71e271635`

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

### **4. MELIHAT SEMUA PRODUCT**

Read ALL Product di MongoDB

**`URL : ${BaseURL}/api/v1/product/read-all-product`**

<center><img src="imageMD/img_8.png" width="200"></center>

**METHOD : GET**

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

### **5. MENGHAPUS SATU PRODUCT**

Delete Satu Product di MongoDB dari id nya

**`URL : ${BaseURL}/api/v1/product/delete-one-product`**

**`NO IMG`**

**METHOD : GET**

***PARAMS (ID Product) :***

`${BaseURL}/api/v1/product/delete-one-product/61e65e24612d6a1f9f82a417`

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

### **6. MENGHAPUS SEMUA PRODUCT**

Delete ALL Product di MongoDB

**`URL : ${BaseURL}/api/v1/product/delete-all-product`**

**`NO IMG`**

**METHOD : GET**

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi"
}
```

---

</details>

# Endpoint ADMIN

***Total 6***

**<details><summary>List Endpoint</summary>**

##### *Defined in <a href="https://github.com/IAGORA-Project/BE-API/blob/main/router/admin/router_admin.js">router/admin/router_admin.js</a>*

Register/Login Serta Endpoint Admin Lainnya Berbasis Website.

Headers Tambahan Pada Setiap Endpoint Admin : 

```js
headers: {
    'auths': 'iagoraid'
}

```
##### *Defined in <a href="https://github.com/IAGORA-Project/BE-API/blob/main/router/token.js#L58">router/token.js:58</a>*


### **1. Register ADMIN**

Register dan Push Data Admin ke MongoDB

**`URL : ${BaseURL}/api/v1/admin/register-admin`**

**`NO IMG`**

**METHOD : POST**

***BODY (no_hp, password, nama) :***

```js
{
    "no_hp": "6287715579966",
    "password": "rifky123", 
    "nama": "Rifky" 
}
```

***HEADERS (sessid, cookie, client-type, auths) :***

```js
headers: {
    "sessid": "abcdefghi",
    'auths': 'iagoraid'
}
```

### **2. Login ADMIN**

Login Admin

**`URL : ${BaseURL}/api/v1/admin/login-admin`**

**`NO IMG`**

**METHOD : POST**

***BODY (no_hp, password) :***

```js
{
    "no_hp": "6287715579966",
    "password": "rifky123",
}
```

***HEADERS (sessid, cookie, client-type, auths) :***

```js
headers: {
    "sessid": "abcdefghi",
    'auths': 'iagoraid'
}
```

### **3. Check Data ADMIN**

GET Data Admin di MongoDB

**`URL : ${BaseURL}/api/v1/admin/check-admin`**

**`NO IMG`**

**METHOD : GET**

***HEADERS (sessid, cookie, client-type, auths) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "admin",
    'auths': 'iagoraid'
}
```

### **4. Change Data ADMIN**

Menganti Data Admin dan Push ke MongoDB

**`URL : ${BaseURL}/api/v1/admin/change-data-admin`**

**`NO IMG`**

**METHOD : POST**

***BODY (no_hp, password, nama) :***

```js
{
    "no_hp": "6287715579966",
    "password": "upin123", 
    "nama": "Upin" 
}
```
**`NB: Body Tidak Harus Diisi Semua, Bisa Salah Satu Saja Yang Ingin Di Perbarui`**

***HEADERS (sessid, cookie, client-type, auths) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "admin",
    'auths': 'iagoraid'
}
```

### **5. Add Income WINGMAN**

Menambahkan Income Wingman Melalui Admin

**`URL : ${BaseURL}/api/v1/admin/add-income`**

**`NO IMG`**

**METHOD : POST**

***BODY (added, id) :***

```js
{
    "added": "10000",
    "id": "61f7eeb1dc89638055eafef8" // ID WINGMAN
}
```

***HEADERS (sessid, cookie, client-type, auths) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "admin",
    'auths': 'iagoraid'
}
```

### **6. Delete One ADMIN**

Menghapus 1 Document Admin

**`URL : ${BaseURL}/api/v1/admin/delete-one-admin`**

**`NO IMG`**

**METHOD : GET**

***PARAMS (ID Admin) :***

`${BaseURL}/api/v1/admin/delete-one-admin/61f5cb068e9e9b9583ed5cec`

***HEADERS (sessid) :***

```js
headers: {
    "sessid": "abcdefghi",
    'auths': 'iagoraid'
}
```
---

</details>

# Endpoint CHAT Customer Service

***Total 6***

**<details><summary>List Endpoint</summary>**

##### *Defined in <a href="https://github.com/IAGORA-Project/BE-API/blob/main/lib/chat/router/router_chat.js#L53">lib/chat/router/router_chat.js:53</a>*

## Sisi User/Wingman

### **1. Page Awal Chat**

Membuat Room Dan Mengirimkan Pesan Awal Jika Tidak Ada Room Antar Admin dan User/Wingman (Juga Digunakan Untuk GET History Chat)

**`URL : ${BaseURL}/api/v1/chat/page-cs`**

<center><img src="imageMD/img_23.png" height="200"></center>

**METHOD : GET**

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "user"
}
```

Jika Tidak Ada Chat Maka Langsung Mengirimkan Text Awal CS

<center><img src="imageMD/img_24.png" height="150"></center>

### **2. User/Wingman Send Message**

Mengirimkan Pesan Dari User/Wingman

**`URL : ${BaseURL}/api/v1/chat/user-sendmsg`**

<center><img src="imageMD/img_25.png" height="200"></center>

**METHOD : POST**

***BODY (message) :***

```js
{
    "message": "aplikasi saya kadang tertutup"
}
```

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "user"
}
```

Setelah Selesai User/Wingman Send Text Maka CS Otomatis Akan Mengirimkan Pesan Mengunggu

## Sisi Admin / CS

### **1. CS/Admin Send Message**

Mengirimkan Pesan Dari CS/Admin

**`URL : ${BaseURL}/api/v1/chat/cs-sendmsg`**

**`NO IMG`**

**METHOD : POST**

***BODY (message, user_id) :***

```js
{
    "message": "Siap kak Sistem Sudah Kami Perbaiki, Silahkan Dicoba Lagi",
    "user_id": "61f616188e9e9b9583ed5d56" // Target User/Wingman
}
```

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "admin",
    "auths": "iagoraid"
}
```

### **2. CS/Admin History Message In One Room**

Melihat History Pesan Dari Sisi CS/Admin

**`URL : ${BaseURL}/api/v1/chat/history-cs`**

**`NO IMG`**

**METHOD : GET**

***PARAMS (room) :***

`${BaseURL}/api/v1/chat/history-cs/61f62d047091d40478298ab5`

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "admin",
    "auths": "iagoraid"
}
```

### **3. Delete One Message**

Menghapus satu Message dari id message

**`URL : ${BaseURL}/api/v1/chat/delete-one`**

**`NO IMG`**

**METHOD : GET**

***PARAMS (id message, room) :***

`${BaseURL}/api/v1/chat/delete-one/61f630aadd4720e1478ce182/61f62d047091d40478298ab5`

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "admin",
    "auths": "iagoraid"
}
```

### **4. Delete All Message In One Room**

Menghapus Semua Message dari id room

**`URL : ${BaseURL}/api/v1/chat/delete-all-msg-room`**

**`NO IMG`**

**METHOD : GET**

***PARAMS (room) :***

`${BaseURL}/api/v1/chat/delete-all-msg-room/61f62d047091d40478298ab5`

***HEADERS (sessid, cookie, client-type) :***

```js
headers: {
    "sessid": "abcdefghi",
    "cookie": "jwt=abcdef", 
    "client-type": "admin",
    "auths": "iagoraid"
}
```
---

</details>

# Endpoint Transaction

Moved to [Transaction Markdown](https://github.com/IAGORA-Project/BE-API/blob/main/Transaction.md)