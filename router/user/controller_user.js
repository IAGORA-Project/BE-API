// const passport = require('passport');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const { default: axios } = require("axios");

const { Token } = require("../../db/Token");
const { randomOtp } = require("../../lib/function");
const { User } = require('../../db/User');

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
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function data_user(req, res) {
    try {
        if (req.user) {
            const data = await User.findOne({ no_hp: req.user.no_hp });
            if (data) {
                return res.status(200).send({
                    data
                })
            } else {
                return res.status(404).send({
                    data: 'not found'
                })
            }
        } else {
            return res.status(403).send({
                status: 403,
                message: 'Login First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function send_otp_user(req, res) {
    try {
        if (!req.body || Object.keys(req.body).length === 0) return res.status(404).send({
            status: 404,
            message: 'input body'
        })
        let { hp } = req.body;
        let random = randomOtp(6);
        let text = `Kode OTP mu Adalah : ${random}`
        await Token.create({ no_hp: hp, token: random })
        axios.get(`${process.env.hostApiWa}/api/send?no=${hp}&text=${text}`).then(({ data }) => {
            if (data) {
                res.status(200).send({
                    status: 200,
                    message: `Success Send Otp to ${hp} Now Go to login submit your OTP code`
                })
            } else {
                res.status(500).send({
                    status: 500,
                    message: `Failed Send Otp to ${hp}`
                })
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send({
                status: 500,
                message: `Failed Send Otp to ${hp}`
            })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function login_user(req, res, next) {
    try {
        if (!req.body || Object.keys(req.body).length === 0) return res.status(404).send({
            status: 404,
            message: 'input body'
        })
        let { username, password } = req.body;
        let findOtp = await Token.findOne({ token: password });
        if (findOtp) {
            if (findOtp.no_hp == username && findOtp.token == password) {
                const finds = await User.findOne({ no_hp: username });
                if (finds == null) {
                    const now = await User.create({
                        type: 'user',
                        no_hp: username,
                        nama: null, profile: null, email: null, alamat: null, cart: []
                    })
                    const token = createJWT(now._id);
                    res.cookie('jwt', token, { httpOnly: true });
                    res.send(now)
                } else {
                    const token = createJWT(finds._id);
                    res.cookie('jwt', token, { httpOnly: true });
                    res.send(finds)
                }
                // passport.authenticate('user', function(err, user, info) {
                //     if (err) { return next(err); }
                //     if (!user) { 
                //         return res.status(403).send({
                //             status: 403,
                //             message: 'No User'
                //         })    
                //     }
                //     req.logIn(user, function(err) {
                //         if (err) { return next(err); }
                //         return res.redirect('/api/v1/user/');
                //     });
                // })(req, res, next);
            } else {
                return res.send({
                    status: 403,
                    message: `OTP and no hp not match`
                })
            }
        } else {
            return res.send({
                status: 403,
                message: `Invalid OTP or OTP Expired`
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function register_user(req, res) {
    try {
        if (req.user) {
            if (!req.body || Object.keys(req.body).length === 0) return res.status(404).send({
                status: 404,
                message: 'input body'
            })
            let { nama, alamat, email } = req.body;
            let { no_hp } = req.user
            const profilePath = `./public/file/user/profile/profile_${no_hp}.png`;
            const profileNone = `./public/file/user/profile/none.png`;
            const profile = fs.existsSync(`./public/user/file/profile/profile_${no_hp}.png`) ? fs.readFileSync(profilePath) : fs.readFileSync(profileNone);
            User.updateOne({ no_hp: no_hp }, { nama, alamat, profile: profile.toString('hex'), email: Buffer.from(email, 'utf8').toString('hex') }, function (err, res) {
                if (err) throw err;
            })
            return res.status(200).send({
                status: 200,
                message: 'Sukses Register User'
            })
        } else {
            return res.status(403).send({
                status: 403,
                message: 'Login OTP First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function change_data_user(req, res) {
    try {
        if (req.user) {
            if (!req.body || Object.keys(req.body).length === 0) return res.status(404).send({
                status: 404,
                message: 'input body'
            })
            let { nama, alamat, email } = req.body;
            const namaFix = nama ? nama : req.user.nama;
            const emailFix = email ? Buffer.from(email, 'utf8').toString('hex') : req.user.email;
            const alamatFix = alamat ? alamat : req.user.alamat;
            User.updateOne({ no_hp: req.user.no_hp }, { nama, namaFix, email, emailFix, alamat: alamatFix }, function (err, res) {
                if (err) throw err;
            })
            return res.status(200).send({
                status: 200,
                message: 'Sukses Change Data User'
            })
        } else {
            return res.status(403).send({
                status: 403,
                message: 'Login OTP First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function logout_user(req, res) {
    try {
        if (req.user) {
            res.cookie('jwt', '', { maxAge: 1 });
            return res.status(200).send({
                status: 200,
                message: 'Logout Sukses'
            })
        } else {
            res.status(403).send({
                status: 403,
                message: 'Login First'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function delete_user(req, res) {
    try {
        if (!req.body || Object.keys(req.body).length === 0) return res.status(404).send({
            status: 404,
            message: 'input body'
        })
        let { no_hp } = req.body;
        if (!req.body.no_hp) return res.status(403).send({
            status: 403,
            message: 'input body phone number'
        })
        User.deleteOne({ no_hp: no_hp }, function (err, res) {
            if (err) throw err;
        })
        return res.status(200).send({
            status: 200,
            message: `Sukses Delete User ${no_hp}`
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function delete_all_user(req, res) {
    try {
        await User.deleteMany({});
        return res.status(200).send({
            status: 200,
            message: 'sukses'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
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
    delete_all_user
}