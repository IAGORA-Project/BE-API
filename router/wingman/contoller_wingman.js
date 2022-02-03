const axios = require('axios');
// const passport = require('passport');
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');

const { Token } = require('../../db/Token');
const { randomOtp } = require('../../lib/function');
const { Wingman } = require('../../db/Wingman');
const { waApi, respons } = require('../../lib/setting');

let submitData = false

const maxAge = Math.floor(Date.now() / 1000) + (60 * 60)

const createJWT = id => {
    return jwt.sign({ id }, 'created room', {
        expiresIn: '1h'
    })
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

async function send_otp(req, res) {
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
        axios.get(`${waApi}/api/v1/send?no=${no_hp}&text=${text}`).then(({ data }) => {
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

async function login_wingman(req, res, next) {
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
                const finds = await Wingman.findOne({ no_hp: no_hp });
                if (finds == null) {
                    const profileNone = `./public/file/wingman/profile/none.png`;
                    const profile = fs.readFileSync(profileNone);
        
                    const now = await Wingman.create({
                        type: 'wingman',
                        no_hp: no_hp,
                        nama: null, pin: null, file: null, email: null, alamat: null, kota: null, pasar: null, bank: null, no_rek: null, nama_rek: null,
                        profile: profile.toString('hex'), ktp: null, skck: null, available: true, stars: { starsTotal: 0, countTotal: 0, result: 0, stars: [
                            { star: 1, count: 0 },
                            { star: 2, count: 0 },
                            { star: 3, count: 0 },
                            { star: 4, count: 0 },
                            { star: 5, count: 0 }
                        ]}, 
                        today_order: 0, total_order:  0, income: 0, on_process: [], kotak_saran: []
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

async function submit_data(req, res) {
    try {
        const { nama, email, alamat, kota, pasar, bank, no_rek, nama_rek } = req.body;
        if (!nama || !email || !alamat || !kota || !pasar || !bank || !no_rek || !nama_rek || Object.keys(req.body).length === 0) 
        return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedBody,
            message: 'input body'
        })
        if (req.user) {
            const { no_hp } = req.user;
            if (!fs.existsSync(`./db/data/${no_hp}.json`)) {
                let arr = []
                fs.writeFileSync(`./db/data/${no_hp}.json`, JSON.stringify(arr));
            }

            const debeh = JSON.parse(fs.readFileSync(`./db/data/${no_hp}.json`));
            const ktpPath = `./public/file/wingman/ktp/ktp_${no_hp}.png`
            const ktp = fs.existsSync(ktpPath) ? fs.readFileSync(ktpPath) : null;
            if (!ktp) {
                fs.unlinkSync(`./db/data/${no_hp}.json`);
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.FileNotFound,
                    message: 'KTP Kosong'
                })
            }
            const skckPath = `./public/file/wingman/skck/skck_${no_hp}.png`;
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
            submitData = true;
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: 'Sukses Submit Data, Selanjutnya preview'
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
    router_wingman,
    data_wingman,
    send_otp, 
    login_wingman, 
    submit_data, 
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