const multer = require('multer');
const { basicResponse } = require('./basic-response');


const productUpload = () => {
  const ImageDIR = './public/images/products';

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, ImageDIR);
    },
    filename: (req, file, cb) => {
      const random = new Date().getTime()
      const getString = file.originalname.split('.')
      const ext = getString[getString.length - 1]
      const fileName = `${random}.${ext}`
      cb(null, fileName)
    }
  });
  
  const imageUpload = multer({
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

  return imageUpload
}

const userUpload = () => {
  const ImageDIR = './public/images/user';

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, ImageDIR);
    },
    filename: (req, file, cb) => {
      const random = new Date().getTime()
      const getString = file.originalname.split('.')
      const ext = getString[getString.length - 1]
      const fileName = `${random}.${ext}`
      cb(null, fileName)
    }
  });
  
  const imageUpload = multer({
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

  return imageUpload
}

module.exports = {
  productUpload,
  userUpload
}