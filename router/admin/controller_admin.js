const { Wingman } = require("../../db/Wingman");
const { User } = require('../../db/User');
const { respons } = require("../../lib/setting");
const fs = require('fs-extra');

const jwt = require('jsonwebtoken');
const { Admin } = require("../../db/Admin");
const createJWT = id => {
    return jwt.sign({ id }, 'created room', {
        expiresIn: '1h'
    })
}

async function register_admin(req, res) {
    try {
        let { no_hp, password, nama } = req.body;
        if (!no_hp || !password || Object.keys(req.body).length === 0) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedBodyHP,
            message: 'input body hp'
        })
        let find = await Admin.findOne({ no_hp });
        if (find) {
            return res.status(403).send({
                status: res.statusCode,
                code: respons.AdminIsRegistered,
                message: `Admin dengan no_hp : ${no_hp} sudah terdaftar`
            })
        } else {
            const profileNone = `./public/file/user/profile/none.png`;
            const profile = fs.readFileSync(profileNone);
            let up = await Admin.create({ type: 'admin', no_hp, password: Buffer.from(password, 'utf8').toString('hex'), nama, profile: profile.toString('hex') });
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `Register Sukses, kembali ke halaman login admin`,
                result: up
            })
        } 

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});  
    }
}

async function login_admin(req, res) {
    try {
        let { no_hp, password } = req.body;
        if (!no_hp || !password || Object.keys(req.body).length === 0) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedBodyHP,
            message: 'input body hp'
        })
        let find = await Admin.findOne({ no_hp });
        if (find) {
            if (Buffer.from(find.password, 'hex').toString('utf8') == password) {
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
                    message: 'Wrong Password'
                })
            }
        } else {
            return res.status(401).send({
                status: res.statusCode,
                code: respons.AdminNotFound,
                message: 'Admin Not Found, Register First'
            })
        } 

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});   
    }
}

async function check_admin(req, res) {
    try {
        if (req.user.type == 'admin') {
            let find = await Admin.findOne({ no_hp: req.user.no_hp });
            if (find) {
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Get Data Admin`,
                    result: find
                })
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.AdminNotFound,
                    message: 'Admin Not Found'
                })
            }
        } else {
            return res.status(403).send({
                status: res.statusCode,
                code: respons.AccessDenied,
                message: 'Access Denied'
            })
        } 
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});   
    }
}

async function change_data_admin(req, res) {
    try {
        if (req.user.type == 'admin') {
            let { nama, no_hp, password } = req.body;
            if (!req.body || Object.keys(req.body).length === 0) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedBodyHP,
                message: 'input body hp'
            })
            let find = await Admin.findOne({ no_hp: req.user.no_hp });
            if (find) {
                let namaFix = nama ? nama : find.nama;
                let no_hpFix = no_hp ? no_hp : find.no_hp;
                let passwordFix = password ? Buffer.from(password, 'utf8').toString('hex') : find.password;
                let up = await Admin.updateOne({ no_hp: req.user.no_hp }, { nama: namaFix, no_hp: no_hpFix, password: passwordFix });
                let findAgain = await Admin.findOne({ no_hp: req.user.no_hp });
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Change Data Admin`,
                    result: findAgain
                })
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.AdminNotFound,
                    message: 'Admin Not Found'
                })
            }
        } else {
            return res.status(403).send({
                status: res.statusCode,
                code: respons.AccessDenied,
                message: 'Access Denied'
            })
        } 
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});  
    }
}

async function delete_one_admin(req, res) {
    try {
        let { id_admin } = req.params;
        let find = await Admin.findOne({ _id: id_admin });
        if (find) {
            let deletes = await Admin.deleteOne({ _id: id_admin });
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `Sukses Delete Data Admin : ${id_admin}`
            })
        } else {
            return res.status(404).send({
                status: res.statusCode,
                code: respons.AdminNotFound,
                message: 'Admin Not Found'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});  
    }
}

async function in_belumBayar(req, res) {
    try {
        if (req.user.type == 'admin') {
            let findAll = await Wingman.find({});
            if (findAll) {
                let { status } = req.body;
                if (!status) return res.status(403).send({
                    status: res.statusCode,
                    code: respons.NeedBody,
                    message: 'Input body array'
                })
                if (Array.isArray(status) && status.length) {
                    let arr = []
                    for (let i = 0; i < findAll.length; i++) {
                        for (let j = 0; j < status.length; j++) {
                            let find = findAll[i].on_process.filter(x => x.status == status[j]);
                            for (let i = 0; i < find.length; i++) {
                                arr.push(find[i])
                            }
                        }
                    }
                    return res.status(200).send({
                        status: res.statusCode,
                        code: respons[200],
                        message: `Menampilkan Array Status Tertentu`,
                        result: arr
                    })
                } else {
                    return res.status(403).send({
                        status: res.statusCode,
                        code: respons.WrongBody,
                        message: 'Body Array status!'
                    }) 
                }
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.WingmanNotFound,
                    message: `Wingman Not Found / Wingman = 0`
                })
            }
        } else {
            return res.status(403).send({
                status: res.statusCode,
                code: respons.AccessDenied,
                message: 'Access Denied'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function status_dibayar(req, res) {
    try {
        if (req.user.type == 'admin') {
            let { id_order } = req.params;
            if (!id_order) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedParams,
                message: `Input Params`
            })
            let indexOrder = 0
            let wingmans = 0
            let arr = []
            let findAll = await Wingman.find({});
            if (findAll) {
                for (let i = 0; i < findAll.length; i++) {
                    let find = findAll[i].on_process.findIndex(x => x.id_order == id_order);
                    if (find !== -1) {
                        indexOrder += find
                        wingmans += i
                        arr = findAll[i].on_process
                    }
                }
                if (findAll[wingmans].on_process[indexOrder].status < 4) return res.status(403).send({
                    status: res.statusCode,
                    code: respons.AccessDenied,
                    message: 'Status Order ini di bawah 4, hanya bisa mengganti status = 4'
                })
                findAll[wingmans].on_process[indexOrder].status = `5`

                let findUser = await User.findOne({ _id: findAll[wingmans].on_process[indexOrder].user_id });
                let transaksiUser = findUser.transaction
                let indexTransaksiUser = transaksiUser.findIndex(x => x.id_order == id_order);
                transaksiUser[indexTransaksiUser] = findAll[wingmans].on_process[indexOrder]

                let up1 = await Wingman.updateOne({ _id: findAll[wingmans].on_process[indexOrder].wingman_id }, { on_process: findAll[wingmans].on_process })
                let up2 = await User.updateOne({ _id: findAll[wingmans].on_process[indexOrder].user_id }, { transaction: transaksiUser })
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Mengganti Status, Order ID ${id_order} Wingman ${findAll[wingmans].on_process[indexOrder].wingman_id} User ${findAll[wingmans].on_process[indexOrder].user_id} ke Status Sudah Dibayar / 5`,
                    result: findAll[wingmans].on_process[indexOrder]
                })
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.WingmanNotFound,
                    message: `Wingman Not Found / Wingman = 0`
                })
            }
        } else {
            return res.status(403).send({
                status: res.statusCode,
                code: respons.AccessDenied,
                message: 'Access Denied'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function delete_order(req, res) {
    try {
        if (req.user.type == 'admin') {
            let { id_order, id, type } = req.params;
            if (!id_order) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedParams,
                message: `Input Params`
            })
            if (type == 'wingman') {
                let findWingman = await Wingman.findOne({ _id: id });
                if (findWingman) {
                    let now = findWingman.on_process.filter(item => item.id_order != id_order)
                    let added2 = await Wingman.updateOne({ _id: id }, { on_process: now })
                    return res.status(200).send({
                        status: res.statusCode,
                        code: respons[200],
                        message: `Sukses Menghapus Order ${id_order} dari Wingman ${id}`
                    })
                } else {
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.WingmanNotFound,
                        message: `Wingman Not Found`
                    })
                }
            } else if (type == 'user') {
                let findUser = await User.findOne({ _id: id });
                if (findUser) {
                    let now = findUser.transaction.filter(item => item.id_order != id_order)
                    let added2 = await User.updateOne({ _id: id }, { transaction: now })
                    return res.status(200).send({
                        status: res.statusCode,
                        code: respons[200],
                        message: `Sukses Menghapus Order ${id_order} dari User ${id}`
                    })
                } else {
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.WingmanNotFound,
                        message: `Wingman Not Found`
                    })
                }
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.WrongParams,
                    message: `Wrong Params` 
                })
            }

        } else {
            return res.status(403).send({
                status: res.statusCode,
                code: respons.AccessDenied,
                message: 'Access Denied'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function add_income_wingman(req, res) {
    try {
        if (req.user.type == 'admin') {
            let { added, id } = req.body;
            if (!added || !id) return res.status(404).send({
                status: res.statusCode,
                code: respons.NeedBody,
                message: 'input body'
            })
            let find = await Wingman.findOne({ _id: id })
            let addeds = await Wingman.updateOne({ _id: id }, { income: Number(find.income) + Number(added) })
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `${find.no_hp} income before : ${find.income}, and now : ${Number(find.income) + Number(added)}`
            })
        } else {
            return res.status(403).send({
                status: res.statusCode,
                code: respons.AccessDenied,
                message: 'Access Denied'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

module.exports = {
    register_admin,
    login_admin,
    check_admin,
    change_data_admin,
    delete_one_admin,
    status_dibayar,
    in_belumBayar,
    delete_order,
    add_income_wingman
}