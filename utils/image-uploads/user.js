const multer = require("multer");
const { mkdirSync, existsSync } = require('fs')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const UserDIR = './public/images/user';

    if(!existsSync(UserDIR)) {
      mkdirSync(UserDIR)

      cb(null, UserDIR);
    } else {
      cb(null, UserDIR);
    }
  },
  filename: (req, file, cb) => {
    const random = new Date().getTime()
    const getString = file.originalname.split('.')
    const ext = getString[getString.length - 1]
    const fileName = `${random}.${ext}`
    cb(null, fileName)
  }
});

const userUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return req.res?.status(422).json(basicResponse({
        status: res.statusCode,
        message: 'Harus berupa gambar (.jpg, .jpeg atau .png)',
      }))
    }
  }
});

module.exports = {
  userUpload
}