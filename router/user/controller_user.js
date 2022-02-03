// const passport = require('passport');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const { default: axios } = require("axios");

const { Token } = require("../../db/Token");
const { randomOtp } = require("../../lib/function");
const { User } = require('../../db/User');
const { respons, waApi } = require('../../lib/setting');

const maxAge = Math.floor(Date.now() / 1000) + (60 * 60)

const createJWT = id => {
    return jwt.sign({ id }, 'created room', {
        expiresIn: '1h'
    })
}

async function router_user(req, res) {
    try {
        // if (!req.isAuthenticated()) {
        if (!req.isAuthenticated) {
            return res.status(403).send({
                status: 403,
                message: 'Please login User to continue'
            })
        } else {
            console.log('req.user: ', req.user)
            let { nama } = req.user;
            if (nama == null) {
                return res.status(201).send({
                    status: 201,
                    regis: false,
                    message: 'Login User Berhasil dan Kamu belum registrasi'
                })
            } else {
                return res.status(200).send({
                    status: 200,
                    regis: true,
                    message: 'Login User Sukses dan kamu sudah terdaftar di db'
                })
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

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
        if (!no_hp || Object.keys(req.body).length === 0) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedBodyHP,
            message: 'input body hp'
        })
        let random = randomOtp(6);
        let text = `Kode OTP mu Adalah : ${random}`
        await Token.create({ no_hp: no_hp, token: random })
        await axios.get(`${waApi}/api/v1/send?no=${no_hp}&text=${text}`).then(({ data }) => {
            if (data) {
                res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Success Send Otp to ${no_hp}, login and submit your OTP code`
                })
            } else {
                res.status(503).send({
                    status: res.statusCode,
                    code: respons.FailSendOTP,
                    message: `Failed Send Otp to ${no_hp}`
                })
            }
        }).catch(err => {
            console.log(err);
            res.status(506).send({
                status: res.statusCode,
                code: respons.FailInternalReq,
                message: `Failed Send Otp to ${no_hp}, due to internal request error`
            })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function login_user(req, res, next) {
    try {
        let { no_hp, otp } = req.body;
        if (!no_hp || !otp || Object.keys(req.body).length === 0) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedBodyHP,
            message: 'input body hp'
        })
        let findOtp = await Token.findOne({ token: otp });
        if (findOtp) {
            if (findOtp.no_hp == no_hp && findOtp.token == otp) {
                const finds = await User.findOne({ no_hp: no_hp });
                if (finds == null) {
                    const profileNone = `./public/file/user/profile/none.png`;
                    const profile = fs.readFileSync(profileNone);
        
                    const now = await User.create({
                        type: 'user',
                        no_hp: no_hp, nama: null, pin: null,
                        profile: profile.toString('hex'), email: null, alamat: null, cart: [], transaction: []
                    })
                    const token = createJWT(now._id);
                    res.cookie('jwt', token, { httpOnly: true });
                    return res.status(200).send({
                        status: res.statusCode,
                        code: respons[200],
                        message: `Login Sukses`,
                        result: now
                    })
                } else {
                    const token = createJWT(finds._id);
                    res.cookie('jwt', token, { httpOnly: true });
                    return res.status(200).send({
                        status: res.statusCode,
                        code: respons[200],
                        message: `Login Sukses`,
                        result: finds
                    })
                }
            } else {
                return res.status(403).send({
                    status: res.statusCode,
                    code: respons.NotMatch,
                    message: `OTP and no hp not match`
                })
            }
        } else {
            return res.status(406).send({
                status: res.statusCode,
                code: respons.InvalidOTP,
                message: `Invalid OTP or OTP Expired`
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
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
    login_user,
    router_user,
    register_user,
    change_data_user,
    logout_user,
    delete_user,
    delete_all_user,
    input_Pin,
    enterPin
}