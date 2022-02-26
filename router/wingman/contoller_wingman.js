const axios = require('axios');
// const passport = require('passport');
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');

const { OneTimePassword } = require('../../db/OneTimePassword');
const { randomOtp } = require('../../lib/function');
const { Wingman } = require('../../db/Wingman');
const { waApi, respons } = require('../../lib/setting');
const { basicResponse } = require('../../utils/basic-response');
const { generateRefreshToken, generateAccessToken } = require('../../utils/authentication');
const { isValidObjectId } = require('mongoose');

let submitData = false

const maxAge = Math.floor(Date.now() / 1000) + (60 * 60)

const createJWT = id => {
    return jwt.sign({ id }, 'created room', {
        expiresIn: '1h'
    })
}

async function getAccessToken(req, res) {
    const refreshToken = req.headers['x-refresh-token']
    const decode = jwt.decode(refreshToken.split(' ')[1])
    const wingmanId = decode.jti
    
    if(!decode.type) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            message: "Token tidak valid."
        }))
    } else if(decode.type !== 'wingman') {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            message: "Token tidak dikenali."
        }))
    }

    try {
        const wingman = await Wingman.findById(wingmanId)
        const baseUrl = `${req.protocol}://${req.hostname}`

        if(wingman) {
            const accessToken = generateAccessToken(wingman._id, wingman.no_hp, 'wingman', baseUrl)

            return res.status(200).json(basicResponse({
                status: res.statusCode,
                message: "Access token akan expire dalam 24 jam.",
                result: { wingmanId: wingman._id, accessToken }
            }))
        }

        return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: "Wingman tidak ditemukan!"
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }))
    }
}

async function router_wingman(req, res) {
    try {
        if (!req.isAuthenticated) {
            return res.status(403).send({
                status: 403,
                message: 'Please login Wingman to continue'
            })
        } else {
            console.log('req.user: ', req.user)
            let { nama } = req.user;
            if (nama == null) {
                return res.status(201).send({
                    status: 201,
                    regis: false,
                    message: 'Login Wingman Berhasil dan Kamu belum registrasi'
                })
            } else {
                return res.status(200).send({
                    status: 200,
                    regis: true,
                    message: 'Login Wingman Sukses dan kamu sudah terdaftar di db'
                })
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function data_wingman(req, res) {
    try {
        if (req.user) {
            const data = await Wingman.findOne({ no_hp: req.user.no_hp });
            if (data) {
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Data ${req.user.no_hp} Ditemukan`,
                    result: data
                })
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.WingmanNotFound,
                    message: `Data ${req.user.no_hp} Tidak Ditemukan`
                })
            }
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

async function send_otp_wingman(req, res) {
    try {
        let { no_hp } = req.body;

        const isPhone = /^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/g.test(parseInt(no_hp))
        if(!isPhone) {
            return res.status(400).json(basicResponse({
                status: res.statusCode,
                message: "Nomor hp tidak valid!"
            }))
        }

        const oneTimePassword = await OneTimePassword.findOne({ no_hp })
        const randomOTP = randomOtp(6)

        if(oneTimePassword) {
            // Jika user sudah pernah melakukan request dengan nomor hp
            if(Date.parse(oneTimePassword.expire_at) > Date.now()) {
                // Check apabila expire otpnya berakhir
                // Jika belum expire, kode otp di database dikirim ke user
                try {
                    const sendMessage = await axios.get(`${waApi}/api/v1/otp/${no_hp}/send?message=Kode OTP mu Adalah ${oneTimePassword.otp_code}`)
                
                    if(sendMessage.status === 200) {
                        return res.status(202).json(basicResponse({
                            status: res.statusCode,
                            message: "Segera verifikasi kode otp anda, akan expire dalam 1 menit"
                        }))
                    }
                } catch (error) {
                    return res.status(400).json(basicResponse({
                        status: res.statusCode,
                        message: "Nomor anda tidak terdaftar di whatsapp!"
                    }))
                }
            }

            
            try {
                const sendMessage = await axios.get(`${waApi}/api/v1/otp/${no_hp}/send?message=Kode OTP mu Adalah ${randomOTP}`)
            
                if(sendMessage.status === 200) {
                    // Jika kode otp expire akan dibuat kode baru
                    await OneTimePassword.findOneAndUpdate(
                        { no_hp: oneTimePassword.no_hp }, { otp_code: randomOTP, expire_at: new Date(Date.now() + (1000 * 60)).getTime() }
                    )

                    return res.status(202).json(basicResponse({
                        status: res.statusCode,
                        message: "Segera verifikasi kode otp anda, akan expire dalam 1 menit"
                    }))
                }
            } catch (error) {
                return res.status(400).json(basicResponse({
                    status: res.statusCode,
                    message: "Nomor anda tidak terdaftar di whatsapp!"
                }))
            }
        }

        
        try {
            const sendMessage = await axios.get(`${waApi}/api/v1/otp/${no_hp}/send?message=Kode OTP mu Adalah ${randomOTP}`)
        
            if(sendMessage.status === 200) {
                // Jika belum pernah melakukan request nomor hp, maka akan dibuat data baru
                await OneTimePassword.create({ no_hp, otp_code: randomOTP, expire_at: new Date(Date.now() + (1000 * 60)).getTime() })

                return res.status(202).json(basicResponse({
                    status: res.statusCode,
                    message: "Segera verifikasi kode otp anda, akan expire dalam 1 menit"
                }))
            }
        } catch (error) {
            return res.status(400).json(basicResponse({
                status: res.statusCode,
                message: "Nomor anda tidak terdaftar di whatsapp!"
            }))
        }
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }));
    }
}

async function verifyOtp(req, res) {
    const { no_hp, otp_code } = req.body;

    const isPhone = /^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/g.test(parseInt(no_hp))
    if(!isPhone) {
        return res.status(400).json(basicResponse({
            status: res.statusCode,
            message: "Nomor hp tidak valid!"
        }))
    }

    try {
        const oneTimePassword = await OneTimePassword.findOne({ no_hp })

        // Check apakah user sudah melakukan request otp
        if(oneTimePassword) {
            // Check apakan otp sudah kadaluarsa atau tidak
            if(Date.parse(oneTimePassword.expire_at) > Date.now()) {
                // Jika tidak user melanjutkan pengecekan code otp
                if(otp_code === oneTimePassword.otp_code) {
                    // Jika otp valid check apakah user telah terdaftar
                    // Hapus data otp
                    await oneTimePassword.remove()
                    const wingman = await Wingman.findOne({ no_hp })
                    const baseUrl = `${req.protocol}://${req.hostname}`
                    if(wingman) {
                        const refreshToken = generateRefreshToken(wingman._id, wingman.no_hp, 'wingman', baseUrl)

                        return res.status(200).json(basicResponse({
                            status: res.statusCode,
                            message: 'Varifikasi berhasil!',
                            result: {
                                wingmanId: wingman._id,
                                isComplateRegister: !wingman.wingmanDetail.name ? false : true,
                                refreshToken
                            }
                        }))
                    }

                    // Jika belum maka buat user baru
                    const createNewWingman = await Wingman.create({ type: 'Wingman', no_hp })

                    const refreshToken = generateRefreshToken(createNewWingman._id, createNewWingman.no_hp, baseUrl)

                    return res.status(200).json(basicResponse({
                        status: res.statusCode,
                        message: 'Verifikasi berhasil!',
                        result: {
                            wingmanId: createNewWingman._id,
                            isComplateRegister: !createNewWingman.wingmanDetail.name ? false : true,
                            refreshToken
                        }
                    }))
                }

                // Jika kadaluarsa user gagal melakukan verifikasi dan harus mengulangi request otp
                return res.status(400).json(basicResponse({
                    status: res.statusCode,
                    message: "Kode otp anda tidak sesuai!"
                }))
            }
            
            // Jika kadaluarsa user gagal melakukan verifikasi dan harus mengulangi request otp
            return res.status(400).json(basicResponse({
                status: res.statusCode,
                message: "Kode otp anda sudah kadaluarsa!"
            }))
        }

        // Jika user belum pernah melakukan request OTP
        return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: "Anda belum melakukan request OTP!"
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }));
    }
}

async function complateWingmanDetail(req, res) {
    const { name, email, address, city } = req.body
    const { wingmanId } = req.params

    if(!isValidObjectId(wingmanId)) {
        return res.status(400).json(basicResponse({
            status: res.statusCode,
            message: "ID wingman tidak valid!"
        }))
    }

    try {
        const wingman = await Wingman.findById(wingmanId)

        if(wingman) {
            const updateWingmanDetail = await Wingman.findByIdAndUpdate(wingman._id, {
                $set: { wingmanDetail: { name, email, address, city } }
            }, { new: true })
            
            return res.status(200).json(basicResponse({
                status: res.statusCode,
                message: "Detail wingman berhasil di update.",
                result: updateWingmanDetail
            }))
        }

        return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: "Wingman tidak ditemukan!"
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }));
    }
}

async function complateWingmanDocument(req, res) {
    const { bank, no_rek, nama_rek } = req.body
    const { wingmanId } = req.params
    const ktp = req.files['ktp']
    const skck = req.files['skck']

    if(!ktp) {
        return res.status(422).json(basicResponse({
            status: res.statusCode,
            message: "Foto KTP anda wajib diisi."
        }))
    }
    if(!skck) {
        return res.status(422).json(basicResponse({
            status: res.statusCode,
            message: "Foto SKCK anda wajib diisi."
        }))
    }

    if(!isValidObjectId(wingmanId)) {
        return res.status(400).json(basicResponse({
            status: res.statusCode,
            message: "ID wingman tidak valid!"
        }))
    }

    try {
        const wingman = await Wingman.findById(wingmanId)

        if(wingman) {
            const updateWingmanDocument = await Wingman.findByIdAndUpdate(wingman._id, {
                $set: { wingmanDocument: { bank, no_rek, nama_rek, ktp: ktp[0].filename, skck: skck[0].filename } }
            }, { new: true })
            
            return res.status(200).json(basicResponse({
                status: res.statusCode,
                message: "Document wingman berhasil di update.",
                result: updateWingmanDocument
            }))
        }

        return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: "Wingman tidak ditemukan!"
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }));
    }
}

async function preview_data(req, res) {
    try {
        if (submitData == false) {
            return res.status(400).send({
                status: res.statusCode,
                code: respons.NotSubmitted,
                message: 'Submit data wingman first!'
            })
        } else {
            if (req.user) {
                let { no_hp } = req.user;
                const debeh = JSON.parse(fs.readFileSync(`./db/data/${no_hp}.json`));
                res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Data ditemukan`,
                    result: debeh[0]
                })
            } else {
                return res.status(401).send({
                    status: res.statusCode,
                    code: respons.NeedLoginWingman,
                    message: 'Login Wingman First!'
                })
            }
        } 
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function regsiter_wingman(req, res) {
    try {
        if (req.user) {
            let { no_hp, _id } = req.user;
            const find = await Wingman.findOne({ no_hp: no_hp });
            if (find) {
                if (find.nama == null) {
                    const jsonPath = `./db/data/${no_hp}.json`
                    const jsonPath2 = fs.existsSync(jsonPath) ? fs.readFileSync(jsonPath) : null;

                    if (!jsonPath2) {
                        fs.unlinkSync(`./db/data/${no_hp}.json`);
                        return res.status(404).send({
                            status: res.statusCode,
                            code: respons.FileNotFound,
                            message: 'Submit Data First (JSON Not Found)'
                        })
                    }

                    const debeh = JSON.parse(fs.readFileSync(jsonPath));
                    const { nama, email, alamat, kota, pasar, bank, no_rek, nama_rek, ktp, skck } = debeh[0];
                    Wingman.updateOne({no_hp: no_hp}, { nama, email, alamat, kota, pasar, bank, no_rek, nama_rek, ktp, skck }, function (err, res) {
                        if (err) throw err;
                    })
                    let up = await Wingman.updateOne({no_hp: no_hp}, { nama, email, alamat, kota, pasar, bank, no_rek, nama_rek, ktp, skck })
                    fs.unlinkSync(jsonPath);
                    let finds = await Wingman.findOne({ _id })
                    return res.status(200).send({
                        status: res.statusCode,
                        code: respons[200],
                        message: `Register ${no_hp} Success`,
                        result: finds
                    })
                }  else {
                    res.status(406).send({
                        status: res.statusCode,
                        code: respons.AlreadyInDB,
                        message: 'Already Registered Before'
                    })
                }
            } else {
                return res.status(401).send({
                    status: res.statusCode,
                    code: respons.NeedLoginWingman,
                    message: 'Login Wingman First!'
                })
            }
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

async function delete_submit_data(req, res) {
    try {
        let { no_hp } = req.body;
        if (!no_hp || Object.keys(req.body).length === 0) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedBodyHP,
            message: 'input body hp'
        })
        const find = await Wingman.findOne({ no_hp: no_hp });
        if (fs.existsSync(`./db/data/${no_hp}.json`)) {
            fs.unlinkSync(`./db/data/${no_hp}.json`);
        }
        if (find) {
            if (find.nama !== null) {
                return res.status(403).send({
                    status: res.statusCode,
                    message: 'Foridden, This user has already completed registration! use delete-wingman'
                })
            } else {
                Wingman.deleteOne({ no_hp: no_hp }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Successfully delete null Wingman ${no_hp}`
                })
            }
        } else {
            return res.status(404).send({
                status: res.statusCode,
                code: respons.WingmanNotFound,
                message: 'wingman no hp not found'
            })  
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function delete_wingman_data(req, res) {
    try {
        let { no_hp } = req.body;
        if (!no_hp || Object.keys(req.body).length === 0) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedBodyHP,
            message: 'input body hp'
        })
        const find = await Wingman.findOne({ no_hp: no_hp });
        if (find) {
            if (find.nama !== null) {
                Wingman.deleteOne({ no_hp: no_hp }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Successfully delete Wingman ${no_hp}`
                })
            } else {
                return res.status(403).send({
                    status: res.statusCode,
                    message: `Foridden, This user ${no_hp} is not completed registration or null data! use delete-submit`
                })
            }
        } else {
            return res.status(404).send({
                status: res.statusCode,
                code: respons.WingmanNotFound,
                message: 'wingman no hp not found'
            })  
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function logout_wingman(req, res) {
    try {
        if (req.user) {
            let cookis = req.cookies.jwt;
            res.cookie('jwt', '', { maxAge: 1 });
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `Logout Wingman ${req.user.no_hp} Sukses`,
                result: { cookie_before: cookis }
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

async function switch_available(req, res) {
    try {
        if (req.user) {
            let { status_available } = req.query;
            if (!status_available) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedQuery,
                message: `Input Query`
            })
            if (status_available == 'true') {
                Wingman.updateOne({ no_hp: req.user.no_hp }, { available: true }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Set Available ${req.user.no_hp} = true`
                })
            } else if (status_available == 'false') {
                Wingman.updateOne({ no_hp: req.user.no_hp }, { available: false }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Set Available ${req.user.no_hp} = false`
                })
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.WrongQuery,
                    message: `Wrong Query Request`
                })
            }
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

async function edit_order_today(req, res) {
    try {
        if (req.user) {
            let { action } = req.params;
            if (!action) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedParams,
                message: `Input Params`
            })
            if (action == 'reset') {
                Wingman.updateOne({ no_hp: req.user.no_hp }, { today_order: 0 }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: 'Reset today order to 0'
                })
            } else if (action == 'add') {
                let { added } = req.body;
                if (!added) return res.status(404).send({
                    status: res.statusCode,
                    code: respons.NeedBody,
                    message: 'input body'
                })
                Wingman.updateOne({ no_hp: req.user.no_hp }, { today_order: Number(req.user.today_order) + Number(added) }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `${req.user.no_hp} today order before : ${req.user.today_order}, and now : ${Number(req.user.today_order) + Number(added)}`
                })
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.WrongParams,
                    message: 'invalid params'
                })
            }
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

async function edit_order_total(req, res) {
    try {
        if (req.user) {
            let { action } = req.params;
            if (!action) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedParams,
                message: `Input Params`
            })
            if (action == 'reset') {
                Wingman.updateOne({ no_hp: req.user.no_hp }, { total_order: 0 }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: 'Reset total order to 0'
                })
            } else if (action == 'add') {
                let { added } = req.body;
                if (!added) return res.status(404).send({
                    status: res.statusCode,
                    code: respons.NeedBody,
                    message: 'input body'
                })
                Wingman.updateOne({ no_hp: req.user.no_hp }, { total_order: Number(req.user.total_order) + Number(added) }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `${req.user.no_hp} total order before : ${req.user.total_order}, and now : ${Number(req.user.total_order) + Number(added)}`
                })
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.WrongParams,
                    message: 'invalid params'
                })
            }
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

async function edit_income(req, res) {
    try {
        if (req.user) {
            let { action } = req.params;
            if (!action) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedParams,
                message: `Input Params`
            })
            if (action == 'reset') {
                Wingman.updateOne({ no_hp: req.user.no_hp }, { income: 0 }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: 'Reset income to 0'
                })
            } else if (action == 'add') {
                let { added } = req.body;
                if (!added) return res.status(404).send({
                    status: res.statusCode,
                    code: respons.NeedBody,
                    message: 'input body'
                })
                Wingman.updateOne({ no_hp: req.user.no_hp }, { income: Number(req.user.income) + Number(added) }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `${req.user.no_hp} income before : ${req.user.income}, and now : ${Number(req.user.income) + Number(added)}`
                })
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.WrongParams,
                    message: 'invalid params'
                })
            }
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

async function change_data_wingman(req, res) {
    try {
        if (req.user) {
            if (!req.body || Object.keys(req.body).length === 0) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedBody,
                message: 'input body'
            })
            const { nama, email, alamat, kota, pasar, bank, no_rek, nama_rek } = req.body;
            const namaFix = nama ? nama : req.user.nama;
            const emailFix = email ? Buffer.from(email, 'utf8').toString('hex') : req.user.email;
            const alamatFix = alamat ? alamat : req.user.alamat;
            const kotaFix = kota ? kota : req.user.kota;
            const pasarFix = pasar ? pasar : req.user.pasar;
            const bankFix = bank ? bank : req.user.bank;
            const no_rekFix = no_rek ? Buffer.from(no_rek, 'utf8').toString('hex') : req.user.no_rek;
            const nama_rekFix = nama_rek ? Buffer.from(nama_rek, 'utf8').toString('hex') : req.user.nama_rek;
            let up = await Wingman.updateOne({ no_hp: req.user.no_hp }, { 
                nama: namaFix,
                email: emailFix,
                alamat: alamatFix,
                kota: kotaFix,
                pasar: pasarFix,
                bank: bankFix,
                no_rek: no_rekFix,
                nama_rek: nama_rekFix
            })
            let findAgain = await Wingman.findOne({ _id: req.user._id });
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: 'Sukses change data wingman',
                result: findAgain,
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

async function delete_all_wingman(req, res) {
    try {
        await Wingman.deleteMany({});
        return res.status(200).send({
            status: res.statusCode,
            code: respons[200],
            message: 'Sukses Delete All Wingman'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function input_Pin(req, res) {
    try {
        if (req.user) {
            let { pin } = req.body;
            if (!pin) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedBody,
                message: 'input body'
            })
            if (!req.user.name == null) return res.status(403).send({
                status: res.statusCode,
                code: respons.WingmanNotRegister,
                message: 'Wingman Not Registered'
            })
            let up = await Wingman.updateOne({ no_hp: req.user.no_hp }, { pin: Buffer.from(pin, 'utf8').toString('hex') })
            let findAgain = await Wingman.findOne({ _id: req.user._id })
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: 'Sukses Input PIN Wingman',
                result: findAgain
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

async function enterPIN(req, res) {
    try {
        const jwtToken = req.cookies.jwt;
        if (jwtToken) return res.status(403).send({
            status: res.statusCode,
            code: respons.StillLogin,
            message: `Masih Dalam Kondisi Login!`
        })
        let { no_hp, pin } = req.body;
        if (!no_hp || !pin) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedBody,
            message: `Input body!`
        })
        let find = await Wingman.findOne({ no_hp });
        if (find) {
            let pinFix = Buffer.from(pin, 'utf8').toString('hex')
            if (find.pin == pinFix) {
                const token = createJWT(find._id);
                res.cookie('jwt', token, { httpOnly: true });
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Login Sukses`,
                    result: find
                })  
            } else {
                return res.status(403).send({
                    status: res.statusCode,
                    code: respons.NotMatch,
                    message: 'Wrong PIN'
                })
            }
        } else {
            return res.status(401).send({
                status: res.statusCode,
                code: respons.NeedLoginWingman,
                message: 'Login OTP Wingman First!'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

module.exports = {
    getAccessToken,
    router_wingman,
    data_wingman,
    send_otp_wingman, 
    verifyOtp, 
    complateWingmanDetail,
    complateWingmanDocument,
    preview_data,
    regsiter_wingman,
    delete_submit_data,
    delete_wingman_data,
    logout_wingman,
    switch_available,
    edit_order_today,
    edit_order_total,
    edit_income,
    change_data_wingman,
    delete_all_wingman,
    input_Pin,
    enterPIN
}