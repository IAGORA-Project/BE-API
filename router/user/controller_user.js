// const passport = require('passport');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const { default: axios } = require("axios");

const { OneTimePassword } = require("../../db/OneTimePassword");
const { randomOtp } = require("../../lib/function");
const { User } = require('../../db/User');
const { respons, waApi } = require('../../lib/setting');
const { generateRefreshToken } = require('../../utils/authentication');
const { basicResponse } = require('../../utils/basic-response');

const maxAge = Math.floor(Date.now() / 1000) + (60 * 60)

const createJWT = id => {
    return jwt.sign({ id }, 'created room', {
        expiresIn: '1h'
    })
}

// async function router_user(req, res) {
//     try {
//         // if (!req.isAuthenticated()) {
//         if (!req.isAuthenticated) {
//             return res.status(403).send({
//                 status: 403,
//                 message: 'Please login User to continue'
//             })
//         } else {
//             console.log('req.user: ', req.user)
//             let { nama } = req.user;
//             if (nama == null) {
//                 return res.status(201).send({
//                     status: 201,
//                     regis: false,
//                     message: 'Login User Berhasil dan Kamu belum registrasi'
//                 })
//             } else {
//                 return res.status(200).send({
//                     status: 200,
//                     regis: true,
//                     message: 'Login User Sukses dan kamu sudah terdaftar di db'
//                 })
//             }
//         }

//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
//     }
// }

async function data_user(req, res) {
    try {
        if (req.user) {
            const data = await User.findOne({ no_hp: req.user.no_hp });
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
                    code: respons.UserNotFound,
                    message: `Data ${req.user.no_hp} Tidak Ditemukan`,
                })
            }
        } else {
            return res.status(401).send({
                status: res.statusCode,
                code: respons.NeedLoginUser,
                message: 'Login User First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function send_otp_user(req, res) {
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
                // Jika kode otp expire akan dibuat kode baru
                const updateOtp = await OneTimePassword.findOneAndUpdate(
                    { no_hp }, { otp_code: randomOtp(6), expire_at: new Date(Date.now() + (1000 * 60)).getTime() }, { new: true }
                )

                const sendMessage = await axios.get(`${waApi}/api/v1/otp/${no_hp}/send?message=Kode OTP mu Adalah ${updateOtp.otp_code}`)
            
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
            // Jika belum pernah melakukan request nomor hp, maka akan dibuat data baru
            const createOtp = await OneTimePassword.create({ no_hp, otp_code: randomOtp(6) })

            const sendMessage = await axios.get(`${waApi}/api/v1/otp/${no_hp}/send?message=Kode OTP mu Adalah ${createOtp.otp_code}`)
        
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
    } catch (error) {
        return res.status(500).send(basicResponse({
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
                    const user = await User.findOne({ no_hp })
                    const baseUrl = `${req.protocol}://${req.hostname}`
                    if(user) {
                        const refreshToken = generateRefreshToken(user._id, user.no_hp, baseUrl)

                        return res.status(200).json(basicResponse({
                            status: res.statusCode,
                            message: 'Varifikasi berhasil!',
                            result: { refreshToken }
                        }))
                    }

                    // Jika belum maka buat user baru
                    const createNewUser = await User.create({ type: 'User', no_hp })

                    const refreshToken = generateRefreshToken(createNewUser._id, createNewUser.no_hp, baseUrl)

                    return res.status(200).json(basicResponse({
                        status: res.statusCode,
                        message: 'Verifikasi berhasil!',
                        result: { refreshToken }
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
            status: res.statusCode
        }));
    }
}

async function register_user(req, res) {
    try {
        if (req.user) {
            let { nama, alamat, email } = req.body;
            if (!nama || !email || !alamat) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedBody,
                message: 'input body'
            })
            let { no_hp } = req.user
            let up = await User.updateOne({ no_hp: no_hp }, { nama, alamat,
                email: Buffer.from(email, 'utf8').toString('hex') });
            let findAgain = await User.findOne({ _id: req.user._id })
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: 'Sukses Register User',
                result: findAgain
            })
        } else {
            return res.status(401).send({
                status: res.statusCode,
                code: respons.NeedLoginUser,
                message: 'Login User First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function change_data_user(req, res) {
    try {
        if (req.user) {
            if (!req.body || Object.keys(req.body).length === 0) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedBody,
                message: 'input body'
            })
            const { nama, alamat, email } = req.body;
            const namaFix = nama ? nama : req.user.nama;
            const emailFix = email ? Buffer.from(email, 'utf8').toString('hex') : req.user.email;
            const alamatFix = alamat ? alamat : req.user.alamat;
            let up = await User.updateOne({ no_hp: req.user.no_hp }, { nama: namaFix, email: emailFix, alamat: alamatFix })
            let findAgain = await User.findOne({ _id: req.user._id })
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: 'Sukses Change Data User',
                result: findAgain
            })
        } else {
            return res.status(401).send({
                status: res.statusCode,
                code: respons.NeedLoginUser,
                message: 'Login User First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function logout_user(req, res) {
    try {
        if (req.user) {
            let cookis = req.cookies.jwt;
            res.cookie('jwt', '', { maxAge: 1 });
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `Logout User ${req.user.no_hp} Sukses`,
                result: { cookie_before: cookis }
            })
        } else {
            return res.status(401).send({
                status: res.statusCode,
                code: respons.NeedLoginUser,
                message: 'Login User First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function delete_user(req, res) {
    try {
        let { no_hp } = req.body;
        if (!no_hp || Object.keys(req.body).length === 0) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedBodyHP,
            message: 'input body hp'
        })
        User.deleteOne({ no_hp: no_hp }, function (err, res) {
            if (err) throw err;
        })
        return res.status(200).send({
            status: res.statusCode,
            code: respons[200],
            message: `Sukses Delete User ${no_hp}`
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function delete_all_user(req, res) {
    try {
        await User.deleteMany({});
        return res.status(200).send({
            status: res.statusCode,
            code: respons[200],
            message: 'Sukses Delete All User'
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
                code: respons.UserNotRegister,
                message: 'User Not Registered'
            })
            let up = await User.updateOne({ no_hp: req.user.no_hp }, { pin: Buffer.from(pin, 'utf8').toString('hex') })
            let findAgain = await User.findOne({ _id: req.user._id })
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: 'Sukses Input PIN Wingman',
                result: findAgain
            })
        } else {
            return res.status(401).send({
                status: res.statusCode,
                code: respons.NeedLoginUser,
                message: 'Login User First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function enterPin(req, res) {
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
        let find = await User.findOne({ no_hp });
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
                code: respons.NeedLoginUser,
                message: 'Login OTP User First!'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

module.exports = {
    data_user,
    send_otp_user,
    verifyOtp,
    // router_user,
    register_user,
    change_data_user,
    logout_user,
    delete_user,
    delete_all_user,
    input_Pin,
    enterPin
}