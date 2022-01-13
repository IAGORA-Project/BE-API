const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const Message = require('../../lib/chat/model/Message');
const Room = require('../../lib/chat/model/Room');

let files = ''

class Uploads {
    constructor(req, res, files, type, names) {
        this.no_hp = names;
        this.files = files;
        this.type = type;
    }
    upload() {
        const storage = multer.diskStorage({
            destination: `public/file/${this.type}/${this.files}`,
            filename: (req, file, cb) => {
                if (this.type == 'wingman' || this.type == 'user') {
                    var ext = `.png`
                } else if (this.type == 'chat') {
                    var ext = path.extname(file.originalname)
                }
                cb(null, `${this.files}_${this.no_hp}${ext}`)// + path.extname(file.originalname))
            }
        });
        const upload = multer({
            storage,
            limits: {
                fileSize: 10000000 // 10 MB
            }
        })
        return upload
    }
}

async function upload_ktp(req, res) {
    try {
        files = 'ktp'
        if (req.user) {
            let { type, no_hp } = req.user;
            let up = new Uploads(req, res, files, type, no_hp)
            up.upload().single('file')(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    console.log(err)
                    return res.status(500).json({
                        status: 500,
                        message: "Error Upload File 1"
                    })
                } else if (err) {
                    console.log(err)
                    return res.status(500).json({
                        status: 500,
                        message: "Error no such file or directory"
                    })
                }
                if (!req.file) {
                    return res.status(404).json({
                        status: 404,
                        message: "No file uploaded"
                    })
                }
                
                const read = fs.readFileSync(`./public/file/${type}/${files}/${files}_${no_hp}.png`)
                const result = read.toString('hex');

                res.status(200).json({
                    status: 200,
                    result: {
                        originalname: req.file.originalname,
                        encoding: req.file.encoding,
                        mimetype: req.file.mimetype,
                        size: req.file.size,
                        result,
                        // data: `data:${req.file.mimetype};base64,${Buffer.from(result, 'hex').toString('base64')}`
                    }
                })
            })
        } else {
            return res.status(403).json({
                status: 403,
                message: "Login First"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function upload_skck(req, res) {
    try {
        files = 'skck'
        if (req.user) {
            let { type, no_hp } = req.user;
            let up = new Uploads(req, res, files, type, no_hp)
            up.upload().single('file')(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    console.log(err)
                    return res.status(500).json({
                        status: 500,
                        message: "Error Upload File 1"
                    })
                } else if (err) {
                    console.log(err)
                    return res.status(500).json({
                        status: 500,
                        message: "Error no such file or directory"
                    })
                }
                if (!req.file) {
                    return res.status(404).json({
                        status: 404,
                        message: "No file uploaded"
                    })
                }
                
                const read = fs.readFileSync(`./public/file/${type}/${files}/${files}_${no_hp}.png`)
                const result = read.toString('hex');

                res.status(200).json({
                    status: 200,
                    result: {
                        originalname: req.file.originalname,
                        encoding: req.file.encoding,
                        mimetype: req.file.mimetype,
                        size: req.file.size,
                        result,
                        // data: `data:${req.file.mimetype};base64,${Buffer.from(result, 'hex').toString('base64')}`
                    }
                })
            })
        } else {
            return res.status(403).json({
                status: 403,
                message: "Login First"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function upload_profile_wingman(req, res) {
    try {
        files = 'profile'
        if (req.user) {
            let { type, no_hp } = req.user;
            let up = new Uploads(req, res, files, type, no_hp)
            up.upload().single('file')(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    console.log(err)
                    return res.status(500).json({
                        status: 500,
                        message: "Error Upload File 1"
                    })
                } else if (err) {
                    console.log(err)
                    return res.status(500).json({
                        status: 500,
                        message: "Error no such file or directory"
                    })
                }
                if (!req.file) {
                    return res.status(404).json({
                        status: 404,
                        message: "No file uploaded"
                    })
                }

                const read = fs.readFileSync(`./public/file/${type}/${files}/${files}_${no_hp}.png`)
                const result = read.toString('hex');
                
                res.status(200).json({
                    status: 200,
                    result: {
                        originalname: req.file.originalname,
                        encoding: req.file.encoding,
                        mimetype: req.file.mimetype,
                        size: req.file.size,
                        result,
                        // data: `data:${req.file.mimetype};base64,${Buffer.from(result, 'hex').toString('base64')}`
                    }
                })
            })
        } else {
            return res.status(403).json({
                status: 403,
                message: "Login First"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function upload_profile_user(req, res) {
    try {
        files = 'profile'
        if (req.user) {
            let { type, no_hp } = req.user;
            let up = new Uploads(req, res, files, type, no_hp)
            up.upload().single('file')(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    console.log(err)
                    return res.status(500).json({
                        status: 500,
                        message: "Error Upload File 1"
                    })
                } else if (err) {
                    console.log(err)
                    return res.status(500).json({
                        status: 500,
                        message: "Error no such file or directory"
                    })
                }
                if (!req.file) {
                    return res.status(404).json({
                        status: 404,
                        message: "No file uploaded"
                    })
                }
                
                const read = fs.readFileSync(`./public/file/${type}/${files}/${files}_${no_hp}.png`)
                const result = read.toString('hex');

                res.status(200).json({
                    status: 200,
                    result: {
                        originalname: req.file.originalname,
                        encoding: req.file.encoding,
                        mimetype: req.file.mimetype,
                        size: req.file.size,
                        result,
                        // data: `data:${req.file.mimetype};base64,${Buffer.from(result, 'hex').toString('base64')}`
                    }
                })
            })
        } else {
            return res.status(403).json({
                status: 403,
                message: "Login First"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function upload_file_chat(req, res) {
    try {
        files = 'message'
        let { room, user } = req.params;
        let { text } = req.body;
        let find = await Room.findOne({ _id: room });
        let textFix = text ? text : ''
        const msg = await Message.create({ target_id: find.target, user_id: user, room_id: room, read: false, file: '', text: textFix  })
        let up = new Uploads(req, res, files, 'chat', msg._id);
        up.upload().single('file')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.log(err)
                return res.status(500).json({
                    status: 500,
                    message: "Error Upload File 1"
                })
            } else if (err) {
                console.log(err)
                return res.status(500).json({
                    status: 500,
                    message: "Error no such file or directory"
                })
            }
            if (!req.file) {
                return res.status(404).json({
                    status: 404,
                    message: "No file uploaded"
                })
            }
            const read = fs.readFileSync(`./public/file/chat/${files}/${files}_${msg._id}${path.extname(req.file.originalname)}`)
            const result = read.toString('hex');
            Message.updateOne({ _id: msg._id }, { file: result }, function (err, res) {
                if (err) throw err;
            })
            const finds = await Message.findOne({ id: msg_id });
            const AllChatRoom = await Message.find({ room_id: room });
            return res.status(200).json({
                status: 200,
                message: `Sukses Send Message With File : ${textFix} || from : ${user}  to room : ${room} `,
                data: finds,
                result: {
                    resultFile: result,
                    // data: `data:${req.file.mimetype};base64,${Buffer.from(result, 'hex').toString('base64')}`
                },
                allMessage: AllChatRoom
            })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

module.exports = {
    upload_ktp,
    upload_skck,
    upload_profile_wingman,
    upload_profile_user,
    upload_file_chat
}