const multer = require("multer");
const { mkdirSync, existsSync } = require('fs')
const { Wingman } = require('../../../db/Wingman')
const { basicResponse } = require('../../basic-response')

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { wingmanId } = req.params
    const WingmanDocumentDIR = `./public/images/wingman/documents/${wingmanId}`;

    const wingman = await Wingman.findById(wingmanId)

    if(wingman) {
      if(!existsSync(WingmanDocumentDIR)) {
        mkdirSync(WingmanDocumentDIR)
  
        cb(null, WingmanDocumentDIR);
      } else {
        cb(null, WingmanDocumentDIR);
      }
    } else {
      return req.res.status(404).json(basicResponse({
        status: req.res.statusCode,
        message: "Wingman not found!"
      }))
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

const wingmanDocumentUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return req.res?.status(422).json(basicResponse({
        status: req.res.statusCode,
        message: 'Harus berupa gambar (.jpg, .jpeg atau .png)',
      }))
    }
  }
});

module.exports = {
  wingmanDocumentUpload
}