const axios = require('axios');
// const passport = require('passport');
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');

const { Token } = require('../../db/Token');
const { randomOtp } = require('../../lib/function');
const { Wingman } = require('../../db/Wingman');

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
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function data_wingman(req, res) {
    try {
        if (req.user) {
            const data = await Wingman.findOne({ no_hp: req.user.no_hp });
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

async function send_otp(req, res) {
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

async function login_wingman(req, res, next) {
    try {
        if (!req.body || Object.keys(req.body).length === 0) return res.status(404).send({
            status: 404,
            message: 'input body'
        })
        let { username, password } = req.body;
        let findOtp = await Token.findOne({ token: password });
        if (findOtp) {
            if (findOtp.no_hp == username && findOtp.token == password) {
                const finds = await Wingman.findOne({ no_hp: username });
                if (finds == null) {
                    const now = await Wingman.create({
                        type: 'wingman',
                        no_hp: username,
                        nama: null, file: null, email: null, alamat: null, kota: null, pasar: null, bank: null, no_rek: null, nama_rek: null,
                        ktp: null, skck: null, available: true, stars: 0, today_order: 0, total_order:  0, income: 0, on_process: []
                    })
                    const token = createJWT(now._id);
                    res.cookie('jwt', token, { httpOnly: true });
                    res.send(now)
                } else {
                    const token = createJWT(finds._id);
                    res.cookie('jwt', token, { httpOnly: true });
                    res.send(finds)
                }
                // passport.authenticate('wingman', function(err, user, info) {
                //     if (err) { return next(err); }
                //     if (!user) { 
                //         return res.status(403).send({
                //             status: 403,
                //             message: 'No Wingman'
                //         })    
                //     }
                    
                //     req.logIn(user, function(err) {
                //         if (err) { return next(err); }
                //         console.log(req.isAuthenticated())
                //         // return res.redirect('/api/v1/wingman');
                //         res.status(200).send(req.user);
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

async function submit_data(req, res) {
    try {
        if (!req.body || Object.keys(req.body).length === 0) return res.status(404).send({
            status: 404,
            message: 'input body'
        })
        const { nama, email, alamat, kota, pasar, bank, no_rek, nama_rek } = req.body;
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
                    status: 404,
                    message: 'KTP Kosong'
                })
            }
            const skckPath = `./public/file/wingman/skck/skck_${no_hp}.png`;
            const skck = fs.existsSync(skckPath) ? fs.readFileSync(skckPath) : null;
            const profilePath = `./public/file/wingman/profile/profile_${no_hp}.png`;
            const profileNone = `./public/file/wingman/profile/none.png`;
            const profile = fs.existsSync(`./public/wingman/file/profile/profile_${no_hp}.png`) ? fs.readFileSync(profilePath) : fs.readFileSync(profileNone);
            const skckFix = skck ? skck.toString('hex') : null
            
            if (Array.isArray(debeh) && debeh.length) {
                debeh[0] = { nama, email: Buffer.from(email, 'utf8').toString('hex'), alamat, kota, pasar, 
                    bank, no_rek: Buffer.from(no_rek, 'utf8').toString('hex'), nama_rek: Buffer.from(nama_rek, 'utf8').toString('hex'), 
                    ktp: ktp.toString('hex'), skck: skckFix, profile: profile.toString('hex') };
            } else {
                debeh.push({ nama, email: Buffer.from(email, 'utf8').toString('hex'), alamat, kota, pasar, 
                    bank, no_rek: Buffer.from(no_rek, 'utf8').toString('hex'), nama_rek: Buffer.from(nama_rek, 'utf8').toString('hex'), 
                    ktp: ktp.toString('hex'), skck: skckFix, profile: profile.toString('hex') });
            }
            fs.writeFileSync(`./db/data/${no_hp}.json`, JSON.stringify(debeh));
            submitData = true;
            return res.status(200).send({
                status: 200,
                message: 'Sukses Submit Data, Selanjutnya preview'
            })
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

async function preview_data(req, res) {
    try {
        if (submitData == false) {
            return res.status(400).send({
                status: 400,
                message: 'Submit data wingman first!'
            })
        } else {
            if (req.user) {
                let { no_hp } = req.user;
                const debeh = JSON.parse(fs.readFileSync(`./db/data/${no_hp}.json`));
                const { nama, email, alamat, kota, pasar, bank, no_rek, nama_rek, ktp, skck, profile } = debeh[0];
                res.status(200).send({
                    status: 200,
                    no_hp, nama, email, alamat, kota, pasar, bank, no_rek, nama_rek, ktp, skck, profile
                })
            } else {
                return res.status(403).send({
                    status: 403,
                    message: 'Login First!'
                })
            }
        } 
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function regsiter_wingman(req, res) {
    try {
        if (req.user) {
            let { no_hp } = req.user;
            const find = await Wingman.findOne({ no_hp: no_hp });
            if (find) {
                if (find.nama == null) {
                    const debeh = JSON.parse(fs.readFileSync(`./db/data/${no_hp}.json`));
                    const { nama, email, alamat, kota, pasar, bank, no_rek, nama_rek, ktp, skck, profile } = debeh[0];
                    Wingman.updateOne({no_hp: no_hp}, { nama, email, alamat, kota, pasar, bank, no_rek, nama_rek, ktp, skck, profile }, function (err, res) {
                        if (err) throw err;
                    })
                    fs.unlinkSync(`./db/data/${no_hp}.json`);
                    submitData = false;
                    return res.status(200).send({
                        status: 200,
                        message: 'Register Success'
                    })
                }  else {
                    res.status(403).send({
                        status: 403,
                        message: 'Already Registered Before'
                    })
                }
            } else {
                res.status(403).send({
                    status: 403,
                    message: 'Not found, Login First Using Phone Number'
                })
            }
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

async function delete_submit_data(req, res) {
    try {
        if (!req.body || Object.keys(req.body).length === 0) return res.status(404).send({
            status: 404,
            message: 'input body'
        })
        let { no_hp } = req.body;
        const find = await Wingman.findOne({ no_hp: no_hp });
        if (fs.existsSync(`./db/data/${no_hp}.json`)) {
            fs.unlinkSync(`./db/data/${no_hp}.json`);
        }
        if (find) {
            if (find.nama !== null) {
                return res.status(403).send({
                    status: 403,
                    message: 'Foridden, This user has already completed registration'
                })
            } else {
                Wingman.deleteOne({ no_hp: no_hp }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: 200,
                    message: 'Successfully delete the data'
                })
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function delete_wingman_data(req, res) {
    try {
        if (!req.body || Object.keys(req.body).length === 0) return res.status(404).send({
            status: 404,
            message: 'input body'
        })
        let { no_hp } = req.body;
        const find = await Wingman.findOne({ no_hp: no_hp });
        if (find) {
            if (find.nama !== null) {
                Wingman.deleteOne({ no_hp: no_hp }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: 200,
                    message: 'Successfully delete the data'
                })
            } else {
                return res.status(403).send({
                    status: 403,
                    message: 'Foridden, This user is not completed registration'
                })
            }
        }  
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function logout_wingman(req, res) {
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

async function switch_available(req, res) {
    try {
        if (req.user) {
            let { status_available } = req.query;
            if (status_available == 'true') {
                Wingman.updateOne({ no_hp: req.user.no_hp }, { available: true }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: 200,
                    message: `Set Available ${req.user.no_hp} = true`
                })
            } else if (status_available == 'false') {
                Wingman.updateOne({ no_hp: req.user.no_hp }, { available: false }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: 200,
                    message: `Set Available ${req.user.no_hp} = false`
                })
            } else {
                return res.status(404).send({
                    status: 404,
                    message: `Input query`
                })
            }
        } else {
            res.status(200).send({
                status: 403,
                message: 'Login First'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function edit_order_today(req, res) {
    try {
        if (req.user) {
            let { action } = req.params;
            if (action == 'reset') {
                Wingman.updateOne({ no_hp: req.user.no_hp }, { today_order: 0 }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: 200,
                    message: 'Reset today order to 0'
                })
            } else if (action == 'add') {
                if (!req.body) return res.status(400).send({
                    status: 404,
                    message: 'input body'
                })
                let { added } = req.body;
                Wingman.updateOne({ no_hp: req.user.no_hp }, { today_order: Number(req.user.today_order) + Number(added) }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: 200,
                    message: `${req.user.no_hp} today order before : ${req.user.today_order}, and now : ${Number(req.user.today_order) + Number(added)}`
                })
            } else {
                return res.status(404).send({
                    status: 404,
                    message: 'invalid params'
                })
            }
        } else {
            res.status(200).send({
                status: 403,
                message: 'Login First'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function edit_order_total(req, res) {
    try {
        if (req.user) {
            let { action } = req.params;
            if (action == 'reset') {
                Wingman.updateOne({ no_hp: req.user.no_hp }, { total_orde: 0 }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: 200,
                    message: 'Reset total order to 0'
                })
            } else if (action == 'add') {
                if (!req.body) return res.status(400).send({
                    status: 404,
                    message: 'input body'
                })
                let { added } = req.body;
                Wingman.updateOne({ no_hp: req.user.no_hp }, { total_orde: Number(req.user.total_orde) + Number(added) }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: 200,
                    message: `${req.user.no_hp} total order before : ${req.user.total_orde}, and now : ${Number(req.user.total_orde) + Number(added)}`
                })
            } else {
                return res.status(404).send({
                    status: 404,
                    message: 'invalid params'
                })
            }
        } else {
            res.status(200).send({
                status: 403,
                message: 'Login First'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function edit_income(req, res) {
    try {
        if (req.user) {
            let { action } = req.params;
            if (action == 'reset') {
                Wingman.updateOne({ no_hp: req.user.no_hp }, { income: 0 }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: 200,
                    message: 'Reset income to 0'
                })
            } else if (action == 'add') {
                if (!req.body) return res.status(400).send({
                    status: 404,
                    message: 'input body'
                })
                let { added } = req.body;
                Wingman.updateOne({ no_hp: req.user.no_hp }, { income: Number(req.user.income) + Number(added) }, function (err, res) {
                    if (err) throw err;
                })
                return res.status(200).send({
                    status: 200,
                    message: `${req.user.no_hp} income before : ${req.user.income}, and now : ${Number(req.user.income) + Number(added)}`
                })
            } else {
                return res.status(404).send({
                    status: 404,
                    message: 'invalid params'
                })
            }
        } else {
            res.status(200).send({
                status: 403,
                message: 'Login First'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function change_data_wingman(req, res) {
    try {
        if (req.user) {
            if (!req.body || Object.keys(req.body).length === 0) return res.status(404).send({
                status: 404,
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
            const nama_rekFix = nama_rek ? nBuffer.from(nama_rek, 'utf8').toString('hex') : req.user.nama_rek;
            Wingman.updateOne({ no_hp: req.user.no_hp }, { 
                nama: namaFix,
                email: emailFix,
                alamat: alamatFix,
                kota: kotaFix,
                pasar: pasarFix,
                bank: bankFix,
                no_rek: no_rekFix,
                nama_rek: nama_rekFix
            }, function (err, res) {
                if (err) throw err;
            })
            return res.status(200).send({
                status: 200,
                message: 'Sukses change data wingman'
            })
        } else {
            res.status(200).send({
                status: 403,
                message: 'Login First'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function delete_all_wingman(req, res) {
    try {
        await Wingman.deleteMany({});
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
    delete_all_wingman
}