require('dotenv').config();
const express = require('express')
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const passport = require('passport');
const helmet = require('helmet');
const MemoryStore = require('memorystore')(session);
const port = process.env.PORT || 5050;

const { connectDb } = require('./db/connect');
connectDb();

const uploadRouter = require('./router/upload/router_upload');
const wingmanRouter = require('./router/wingman/router_wingman');
const userRouter = require('./router/user/router_user');
const chatRouter = require('./lib/chat/router/router_chat');
const productRouter = require('./router/product/router_product');
const tokenRouter = require('./router/token');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('json spaces', 2);
const corsConfig = {
  // origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
app.use(helmet());

app.use(session({
  secret: 'secret',  
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000
  }),
}));

app.use(cookieParser('secret'));

function userIsAllowed(req, res) {
  if (!req.body) return false
  else if (req.body.token == 'token') return true
  else return false
};

var protectPath = function(regex) {
  return function(req, res, next) {
    if (!regex.test(req.url)) { return next(); }

    const allow = userIsAllowed(req, res);
    if (allow) {
      next();
    } else {
      return res.status(403).send({
        status: 403,
        message: 'You are not allowed!'
      })
    }
  };
};

app.use(protectPath(/^\/file\/.*$/));
app.use(express.static('public'))

// PASSPORT
// app.use(passport.initialize());
// app.use(passport.session());
// require('./lib/config')(passport);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.locals.user = req.user || null;
  next();
})

app.get('/', (req, res) => {
  res.send({status: 200, message: 'API ONLINE'})
})

app.get('/endpoint', (req, res) => {
  res.send({
    endpoint: {
      wingman: [
        { end: '/wingman/send-otp-wingman', method: 'post', body: 'hp', query: '', params: '', desc: 'send otp via wa to target number' },
        { end: '/wingman/login-wingman', method: 'post', body: 'username (hp), password (otp)', query: '', params: '', desc: 'input otp untuk login via otp' },
        { end: '/wingman/', method: 'get', body: '', query: '', params: '', desc: 'setelah /login akan d arahkan ke sini. untuk mengecek apakah sudah login, belum registrasi, dan sudah regsitrasi' },
        { end: '/wingman/submit-data', method: 'post', body: 'nama, email, alamat, kota, pasar, bank, no_rek, nama_rek', query: '', params: '', desc: 'input data yang dibutuhkan oleh wingman' },
        { end: '/wingman/preview-wingman', method: 'get', body: '', query: '', params: '', desc: 'untuk preview data json yang d submit sebelum write di mongodb' },
        { end: '/wingman/register-wingman', method: 'get', body: '', query: '', params: '', desc: 'untuk write json yang d preview ke mongodb' },
        { end: '/wingman/wingman-data', method: 'get', body: '', query: '', params: '', desc: 'cek data wingman' },
        { end: '/wingman/change-data-wingman', method: 'post', body: 'nama, email, alamat, kota, pasar, bank, no_rek, nama_rek', query: '', params: '', desc: 'mengubah data wingman (body tdk harus di isi semua)' },
        { end: '/wingman/logout', method: 'get', body: '', query: '', params: '', desc: 'logout wingman' },
        { end: '/wingman/switch-available', method: 'get', body: '', query: 'status_available', params: '', desc: 'untuk mengganti status tersedia wingman' },
        { end: '/wingman/edit-today-order/:action', method: 'post', body: 'added', query: '', params: 'action (add/reset)', desc: 'edit today order, (body added = Number)' },
        { end: '/wingman/edit-total-order/:action', method: 'post', body: 'added', query: '', params: 'action (add/reset)', desc: 'edit total order, (body added = Number)' },
        { end: '/wingman/edit-income/:action', method: 'post', body: 'added', query: '', params: 'action (add/reset)', desc: 'edit income/pendapatan, (body added = Number)' },
        { end: '/wingman/delete-submit', method: 'post', body: 'no_hp', query: '', params: '', desc: 'menghapus document wingman null (setelah login otp, jika belum regis, otomatis create document wingman null)' },
        { end: '/wingman/delete-wingman', method: 'post', body: 'no_hp', query: '', params: '', desc: 'menghapus data wingman, (data wingman yang sudah registrasi/sudah bukan null)' },
      ],
      user: [
        { end: '/user/', method: 'get', body: '', query: '', params: '', desc: 'setelah /login akan d arahkan ke sini. untuk mengecek apakah sudah login, belum registrasi, dan sudah regsitrasi' },
        { end: '/user/send-otp-user', method: 'post', body: 'hp', query: '', params: '', desc: 'send otp via wa to target number' },
        { end: '/user/login-user', method: 'post', body: 'username (hp), password (otp)', query: '', params: '', desc: 'input otp untuk login via otp' },
        { end: '/user/register-user', method: 'post', body: 'nama, alamat, email', query: '', params: '', desc: 'register and write data ke mongodb' },
        { end: '/user/user-data', method: 'get', body: '', query: '', params: '', desc: 'cek data user' },
        { end: '/user/change-data-user', method: 'post', body: 'nama, alamat, email', query: '', params: '', desc: 'mengubah data user (body tdk harus di isi semua)' },
        { end: '/user/logout-user', method: 'get', body: '', query: '', params: '', desc: 'logout user' },
        { end: '/user/delete-user', method: 'post', body: 'no_hp', query: '', params: '', desc: 'delete user' },
      ],
      chat: [
        { end: '/chat/create/:user/:target', method: 'get', body: '', query: '', params: 'user, target', desc: 'membuat private chat / room 2 orang (membutuhkan id user dan id wingman)' },
        { end: '/chat/msg/:room/:user', method: 'post', body: 'message', query: '', params: 'room, user', desc: 'mengirim message (membutuhkan id room, id si pengirim dan body message)' },
        { end: '/chat/get-msg-room/:room', method: 'get', body: '', query: '', params: 'room', desc: 'menampilkan histori message room (membutuhkan id room)' },
        { end: '/chat/delete-msg/:idmsg', method: 'get', body: '', query: '', params: 'idmsg', desc: 'menghapus 1 message (membutuhkan id message)' },
        { end: '/chat/read-msg/:idmsg', method: 'get', body: '', query: '', params: 'idmsg', desc: 'membaca message (membutuhkan id message)' },
        { end: '/upload/chat/file/:room/:user', method: 'post', body: 'text', query: '', params: 'room, user', desc: 'mengirim file message (bisa pakai text atau tanpa text)' },
      ],
      upload: [
        { end: '/upload/wingman/ktp', method: 'post', body: '', query: '', params: '', desc: 'upload wingman ktp' },
        { end: '/upload/wingman/skck', method: 'post', body: '', query: '', params: '', desc: 'upload wingman skck' },
        { end: '/upload/wingman/profile', method: 'post', body: '', query: '', params: '', desc: 'upload wingman profile picture' },
        { end: '/upload/user/profile', method: 'post', body: '', query: '', params: '', desc: 'upload wingman ktp' },
      ],
      file: [
        { end: '/file/*', method: 'get', body: 'token: token', desc: 'membuka file' }
      ]
    }
  })
})

app.get('/tes', (req, res) => {
  console.log(`Ini User : ${req.user}`)
  res.send('oke')
})

app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/wingman', wingmanRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/auth', tokenRouter);
app.use('/api/v1/product', productRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})