require('dotenv').config();
const express = require('express')
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const passport = require('passport');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
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
const adminRouter = require('./router/admin/router_admin');
const transactionUser = require('./router/transaction/user/router_user_transaction')
const transactionWingman = require('./router/transaction/wingman/router_wm_transaction')

const { default: axios } = require('axios');

app.set('trust proxy', 1);
app.use(compression())

app.use(morgan(`ipAddr=:remote-addr date=[:date[web]] method=:method url=":url" status=":status"`))

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.set('view engine', 'ejs');
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

// app.use(protectPath(/^\/file\/.*$/));
app.use(express.static('public'));
// app.use(express.static('public/iagora2_2'));

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

app.get('/tes', (req, res) => {
  res.send('oke')
})

app.get('/arr', (req, res) => {
  res.sendFile('./public/arr.html', { root: __dirname });
})

app.post('/arr', (req, res) => {
  console.log(req.body.arr)
  res.send({
    body: req.body
  })
})

app.get('/api/v1/location', (req, res) => {
  res.status(200).send({
    status: res.statusCode,
    message: 'Menampilkan Pasar dan Kota',
    result: [
      {"city": "Bontang", "market": ["Tanjung-Limau", "Telihan", "Rawa-Indah", "Gajah"]},
      {"city": "Samarinda", "market": ["Segiri", "Graha-Indah", "Ijabah", "Arum-Temindung", "Baqa"]}
    ]
  })
})

app.get('/arrs', (req, res) => {
  let { arr } = req.query;
  console.log(arr)
  res.send({
    arr
  })
})

app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/wingman', wingmanRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/auth', tokenRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/transaction/user', transactionUser);
app.use('/api/v1/transaction/wingman', transactionWingman);

app.get('/tess', async(req, res) => {
  const get = await axios.get(`https://shopee.co.id/api/v2/search_items/?by=relevancy&keyword=wortel&limit=10&newest=0&order=desc&page_type=search&version=2`)
  res.send(get.data);
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})