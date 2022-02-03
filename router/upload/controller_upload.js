const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const { Message } = require('../../lib/chat/model/Message');
const Room = require('../../lib/chat/model/Room');
const { Wingman } = require('../../db/Wingman');
const { User } = require('../../db/User');
const { respons } = require('../../lib/setting');
const { Admin, Transaction } = require('../../db/Admin');
const { randomText } = require('../../lib/function');

let files = []

class Uploads {
    constructor(req, res, files = [], type, names) {
        this.no_hp = names;
        this.files = files;
        this.type = type;
        this.id = req.user._id
    }
    upload() {
        let piles = this.files;
        let dess = piles.length == 2 ? 'berkas' : piles[0]
        const storage = multer.diskStorage({
            destination: `public/file/${this.type}/${dess}`,
            filename: (req, file, cb) => {
                if (this.type == 'wingman' || this.type == 'user' || this.type == 'admin' || this.type == 'transaksi'  || this.type == 'done') {
                    var ext = `.png`
                } else if (this.type == 'chat') {
                    var ext = path.extname(file.originalname)
                }
                cb(null, `${piles[0]}_${this.no_hp}${ext}`)// + path.extname(file.originalname))
                if (piles.length == 2) {
                    piles.shift()
                } 
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

async function upload_all(req, res) {
    try {
        files = ['ktp', 'skck']
        if (req.user) {
            let { type, no_hp } = req.user;
            let up = new Uploads(req, res, files, type, no_hp)
            up.upload().array('file', 4)(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    console.log(err)
                    return res.status(500).json({
                        status: res.statusCode,
                        code: respons.ErrMulter,
                        message: "Error Upload Multer"
                    })
                } else if (err) {
                    console.log(err)
                    return res.status(500).json({
                        status: res.statusCode,
                        code: respons.NoSuchFile,
                        message: "Error no such file or directory"
                    })
                }
                // console.log(req.file)
                // if (!req.file) {
                //     return res.status(404).send({
                //         status: res.statusCode,
                //         code: respons.FileNotFound,
                //         message: 'No File Uploaded'
                //     })
                // }
                const { nama, email, alamat, kota, pasar, bank, no_rek, nama_rek } = req.body;
                if (!nama || !email || !alamat || !kota || !pasar || !bank || !no_rek || !nama_rek || Object.keys(req.body).length === 0) 
                return res.status(403).send({
                    status: res.statusCode,
                    code: respons.NeedBody,
                    message: 'input body'
                })
                if (!fs.existsSync(`./db/data/${no_hp}.json`)) {
                    let arr = []
                    fs.writeFileSync(`./db/data/${no_hp}.json`, JSON.stringify(arr));
                }
                const debeh = JSON.parse(fs.readFileSync(`./db/data/${no_hp}.json`));

                const ktpPath = `./public/file/wingman/berkas/ktp_${no_hp}.png`
                const ktp = fs.existsSync(ktpPath) ? fs.readFileSync(ktpPath) : null;
                if (!ktp) {
                    fs.unlinkSync(`./db/data/${no_hp}.json`);
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.FileNotFound,
                        message: 'KTP Kosong'
                    })
                }

                const skckPath = `./public/file/wingman/berkas/skck_${no_hp}.png`;
                const skck = fs.existsSync(skckPath) ? fs.readFileSync(skckPath) : null;
                const skckFix = skck ? skck.toString('hex') : null

                if (Array.isArray(debeh) && debeh.length) {
                    debeh[0] = { nama, email: Buffer.from(email, 'utf8').toString('hex'), alamat, kota, pasar, 
                        bank, no_rek: Buffer.from(no_rek, 'utf8').toString('hex'), nama_rek: Buffer.from(nama_rek, 'utf8').toString('hex'), 
                        ktp: ktp.toString('hex'), skck: skckFix };
                } else {
                    debeh.push({ nama, email: Buffer.from(email, 'utf8').toString('hex'), alamat, kota, pasar, 
                        bank, no_rek: Buffer.from(no_rek, 'utf8').toString('hex'), nama_rek: Buffer.from(nama_rek, 'utf8').toString('hex'), 
                        ktp: ktp.toString('hex'), skck: skckFix });
                }
                fs.writeFileSync(`./db/data/${no_hp}.json`, JSON.stringify(debeh));

                return res.status(200).json({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Submit Data Wingman ${no_hp}`,
                    result: debeh[0]
                })
            })
        } else {
            return res.status(401).send({
                status: res.statusCode,
                code: respons.NeedLoginWingman,
                message: 'Login Wingman First!'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function upload_ktp(req, res) {
    try {
        files = ['ktp']
        if (req.user) {
            let { type, no_hp } = req.user;
            let up = new Uploads(req, res, files, type, no_hp)
            up.upload().single('file')(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    console.log(err)
                    return res.status(500).json({
                        status: res.statusCode,
                        code: respons.ErrMulter,
                        message: "Error Upload Multer"
                    })
                } else if (err) {
                    console.log(err)
                    return res.status(500).json({
                        status: res.statusCode,
                        code: respons.NoSuchFile,
                        message: "Error no such file or directory"
                    })
                }
                console.log(req.file)
                if (!req.file) {
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.FileNotFound,
                        message: 'No File Uploaded'
                    })
                }
                
                const read = fs.readFileSync(`./public/file/${type}/${files}/${files}_${no_hp}.png`)
                const result = read.toString('hex');

                res.status(200).json({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Upload KTP Wingman ${no_hp}`,
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
            return res.status(401).send({
                status: res.statusCode,
                code: respons.NeedLoginWingman,
                message: 'Login Wingman First!'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function upload_skck(req, res) {
    try {
        files = ['skck']
        if (req.user) {
            let { type, no_hp } = req.user;
            let up = new Uploads(req, res, files, type, no_hp)
            up.upload().single('file')(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    console.log(err)
                    return res.status(500).json({
                        status: res.statusCode,
                        code: respons.ErrMulter,
                        message: "Error Upload Multer"
                    })
                } else if (err) {
                    console.log(err)
                    return res.status(500).json({
                        status: res.statusCode,
                        code: respons.NoSuchFile,
                        message: "Error no such file or directory"
                    })
                }
                if (!req.file) {
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.FileNotFound,
                        message: 'No File Uploaded'
                    })
                }
                
                const read = fs.readFileSync(`./public/file/${type}/${files}/${files}_${no_hp}.png`)
                const result = read.toString('hex');

                res.status(200).json({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Upload SKCK Wingman ${no_hp}`,
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
            return res.status(401).send({
                status: res.statusCode,
                code: respons.NeedLoginWingman,
                message: 'Login Wingman First!'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function upload_profile_wingman(req, res) {
    try {
        files = ['profile']
        if (req.user) {
            let { type, no_hp } = req.user;
            let up = new Uploads(req, res, files, type, no_hp)
            up.upload().single('file')(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    console.log(err)
                    return res.status(500).json({
                        status: res.statusCode,
                        code: respons.ErrMulter,
                        message: "Error Upload Multer"
                    })
                } else if (err) {
                    console.log(err)
                    return res.status(500).json({
                        status: res.statusCode,
                        code: respons.NoSuchFile,
                        message: "Error no such file or directory"
                    })
                }
                if (!req.file) {
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.FileNotFound,
                        message: 'No File Uploaded'
                    })
                }

                const read = fs.readFileSync(`./public/file/${type}/${files}/${files}_${no_hp}.png`)
                const result = read.toString('hex');
                Wingman.updateOne({ no_hp }, { profile: result}, function (err, res) {
                    if (err) throw err;
                })
                res.status(200).json({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Upload Profile Wingman ${no_hp}`,
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
            return res.status(401).send({
                status: res.statusCode,
                code: respons.NeedLoginWingman,
                message: 'Login Wingman First!'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function upload_profile_user(req, res) {
    try {
        files = ['profile']
        if (req.user) {
            let { type, no_hp } = req.user;
            let up = new Uploads(req, res, files, type, no_hp)
            up.upload().single('file')(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    console.log(err)
                    return res.status(500).json({
                        status: res.statusCode,
                        code: respons.ErrMulter,
                        message: "Error Upload Multer"
                    })
                } else if (err) {
                    console.log(err)
                    return res.status(500).json({
                        status: res.statusCode,
                        code: respons.NoSuchFile,
                        message: "Error no such file or directory"
                    })
                }
                if (!req.file) {
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.FileNotFound,
                        message: 'No File Uploaded'
                    })
                }
                
                const read = fs.readFileSync(`./public/file/${type}/${files}/${files}_${no_hp}.png`)
                const result = read.toString('hex');
                User.updateOne({ no_hp }, { profile: result}, function (err, res) {
                    if (err) throw err;
                })
                res.status(200).json({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Upload Profile User ${no_hp}`,
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
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function upload_profile_admin(req, res) {
    try {
        files = ['profile']
        if (req.user) {
            let { type, no_hp } = req.user;
            let up = new Uploads(req, res, files, type, no_hp)
            up.upload().single('file')(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    console.log(err)
                    return res.status(500).json({
                        status: res.statusCode,
                        code: respons.ErrMulter,
                        message: "Error Upload Multer"
                    })
                } else if (err) {
                    console.log(err)
                    return res.status(500).json({
                        status: res.statusCode,
                        code: respons.NoSuchFile,
                        message: "Error no such file or directory"
                    })
                }
                if (!req.file) {
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.FileNotFound,
                        message: 'No File Uploaded'
                    })
                }
                
                const read = fs.readFileSync(`./public/file/${type}/${files}/${files}_${no_hp}.png`)
                const result = read.toString('hex');
                Admin.updateOne({ no_hp }, { profile: result}, function (err, res) {
                    if (err) throw err;
                })
                res.status(200).json({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Upload Profile Admin ${no_hp}`,
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
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function bukti_transaksi(req, res) {
    try {
        files = ['transaksi']
        if (req.user) {
            let { id_order } = req.params;
            if (!id_order) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedParams,
                message: `Input Params`
            })
            let { type, no_hp, transaction } = req.user;
            let index = transaction.findIndex(x => x.id_order == id_order);
            if (index !== -1) {
                let up = new Uploads(req, res, files, 'transaksi', `${id_order}_${transaction[index].wingman_hp}_${transaction[index].user_hp}`)
                up.upload().single('file')(req, res, async function (err) {
                    if (err instanceof multer.MulterError) {
                        console.log(err)
                        return res.status(500).json({
                            status: res.statusCode,
                            code: respons.ErrMulter,
                            message: "Error Upload Multer"
                        })
                    } else if (err) {
                        console.log(err)
                        return res.status(500).json({
                            status: res.statusCode,
                            code: respons.NoSuchFile,
                            message: "Error no such file or directory"
                        })
                    }
                    if (!req.file) {
                        return res.status(404).send({
                            status: res.statusCode,
                            code: respons.FileNotFound,
                            message: 'No File Uploaded'
                        })
                    }

                    let arr = transaction
                    let trans = arr[index]
                    const buktiPath = `./public/file/transaksi/${files[0]}/transaksi_${id_order}_${trans.wingman_hp}_${trans.user_hp}.png`
                    const bukti = fs.existsSync(buktiPath) ? fs.readFileSync(buktiPath) : null;
                    if (!bukti) {
                        return res.status(404).send({
                            status: res.statusCode,
                            code: respons.FileNotFound,
                            message: 'bukti Kosong'
                        })
                    }

                    trans.status = '4'
                    trans.bukti = `http://${req.hostname}/file/transaksi/${files[0]}/transaksi_${id_order}_${trans.wingman_hp}_${trans.user_hp}.png`

                    let findWingman = await Wingman.findOne({ _id: trans.wingman_id });
                    let transaksiWingman = findWingman.on_process
                    let indexTransaksiWingman = transaksiWingman.findIndex(x => x.id_order == id_order);
                    transaksiWingman[indexTransaksiWingman] = trans

                    let added = await Wingman.updateOne({ _id: trans.wingman_id }, { on_process: transaksiWingman })
                    let added2 = await User.updateOne({ _id: trans.user_id }, { transaction: arr })
                    return res.status(200).send({
                        status: res.statusCode,
                        code: respons[200],
                        message: `Sukses Mengupload Bukti dan Merubah Status = 4`,
                        result: trans,
                    })
                })
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.IDOrderNotFound,
                    message: 'id order not found!'
                }) 
            }
        } else {
            return res.status(403).json({
                status: 403,
                message: "Login First"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});   
    }
}

async function order_selesai(req, res) {
    try {
        files = ['transaksi']
        if (req.user.type == 'wingman') {
            let { id_order } = req.params;
            if (!id_order) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedParams,
                message: `Input Params`
            })
            let { type, no_hp, on_process } = req.user;
            let index = on_process.findIndex(x => x.id_order == id_order);
            if (index === -1) return res.status(404).send({
                status: res.statusCode,
                code: respons.IDOrderNotFound,
                message: 'id order not found!'
            }) 
            let up = new Uploads(req, res, files, 'done', `${id_order}_${on_process[index].wingman_hp}_${on_process[index].user_hp}`)
            up.upload().single('file')(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    console.log(err)
                    return res.status(500).json({
                        status: res.statusCode,
                        code: respons.ErrMulter,
                        message: "Error Upload Multer"
                    })
                } else if (err) {
                    console.log(err)
                    return res.status(500).json({
                        status: res.statusCode,
                        code: respons.NoSuchFile,
                        message: "Error no such file or directory"
                    })
                }
                if (!req.file) {
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.FileNotFound,
                        message: 'No File Uploaded'
                    })
                }

                let arr = on_process
                let trans = arr[index]
                const buktiPath = `./public/file/done/${files[0]}/transaksi_${id_order}_${trans.wingman_hp}_${trans.user_hp}.png`
                const bukti = fs.existsSync(buktiPath) ? fs.readFileSync(buktiPath) : null;
                if (!bukti) {
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.FileNotFound,
                        message: 'bukti Kosong'
                    })
                }
                trans.status = `8`
                trans.order_completed = `http://${req.hostname}/file/done/${files[0]}/transaksi_${id_order}_${trans.wingman_hp}_${trans.user_hp}.png`

                let findUser = await User.findOne({ _id: trans.user_id });
                let transaksiUser = findUser.transaction
                let indexTransaksiUser = transaksiUser.findIndex(x => x.id_order == id_order);
                transaksiUser[indexTransaksiUser] = trans

                let added3 = await Transaction.create({ id_order: trans.id_order, wingman_hp: trans.wingman_hp, user_hp: trans.user_hp, detail: trans })

                let added = await Wingman.updateOne({ _id: trans.wingman_id }, { on_process: arr })
                let added2 = await User.updateOne({ _id: trans.user_id }, { transaction: transaksiUser })
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Mengupload Bukti orderan selesai dan Merubah Status = 8`,
                    result: trans,
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
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function upload_file_chat(req, res) {
    try {
        files = ['message']
        let { room, user } = req.params;
        let { text } = req.query;
        let find = await Room.findOne({ _id: room });
        let textFix = text ? text : ''
        const msg = await Message.create({ chat_now: user, target_id: find.target, user_id: user, room_id: room, read: false, file: '', text: textFix  })
        let up = new Uploads(req, res, files, 'chat', msg._id);
        up.upload().single('file')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.log(err)
                return res.status(500).json({
                    status: res.statusCode,
                    code: respons.ErrMulter,
                    message: "Error Upload Multer"
                })
            } else if (err) {
                console.log(err)
                return res.status(500).json({
                    status: res.statusCode,
                    code: respons.NoSuchFile,
                    message: "Error no such file or directory"
                })
            }
            if (!req.file) {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.FileNotFound,
                    message: 'No File Uploaded'
                })
            }
            const read = fs.readFileSync(`./public/file/chat/${files}/${files}_${msg._id}${path.extname(req.file.originalname)}`)
            const result = read.toString('hex');
            Message.updateOne({ _id: msg._id }, { file: result }, function (err, res) {
                if (err) throw err;
            })
            const finds = await Message.findOne({ _id: msg._id });
            const AllChatRoom = await Message.find({ room_id: room });
            res.status(200).json({
                status: res.statusCode,
                code: respons[200],
                message: `Sukses Send Message With File : ${textFix} || from : ${user}  to room : ${room} `,
                result: {
                    data: finds,
                    file: {
                        file_hex: result,
                        file_base64: `data:${req.file.mimetype};base64,${Buffer.from(result, 'hex').toString('base64')}`
                    },
                    allMessage: AllChatRoom
                }
            })
            fs.unlinkSync(`./public/file/chat/${files}/${files}_${msg._id}${path.extname(req.file.originalname)}`);
            return
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

module.exports = {
    upload_ktp,
    upload_skck,
    upload_profile_wingman,
    upload_profile_user,
    upload_profile_admin,
    upload_file_chat,
    upload_all,
    order_selesai,
    bukti_transaksi
}