const { Product } = require("../../../db/Product");
const { User } = require("../../../db/User");
const { Cart } = require("../../../db/Cart");
const { Wingman } = require("../../../db/Wingman");

const { randomText } = require('../../../lib/function');
const { respons } = require("../../../lib/setting");
const { basicResponse } = require('../../../utils/basic-response')
const { isValidObjectId } = require('mongoose');
const { Checkout } = require("../../../db/Checkout");

const checkout = async (req, res) => {
    const { tip, recipientAddress, shippingCost } = req.body
    const { userId } = req.params

    if(!isValidObjectId(userId)) {
        return res.status(400).json(basicResponse({
            status: res.statusCode,
            message: "ID user tidak valid."
        }))
    }

    try {
        const user = await User.findById(userId)

        if(user) {
            const cart = await Cart.findOne({ user: user._id })
        
            if(cart) {
                const newCheckout = new Checkout({
                    user: cart.user,
                    products: cart.products,
                    recipientAddress,
                    tip,
                    total: cart.total,
                    shippingCost,
                    totalHandlingFee: cart.totalHandlingFee
                })
                await newCheckout.save()
                await cart.remove()

                return res.status(201).json(basicResponse({
                    status: res.statusCode,
                    message: "Success",
                    result: newCheckout
                }))
            }

            return res.status(404).json(basicResponse({
                status: res.statusCode,
                message: "Cart anda kosong, tidak bisa melakukan checkout."
            }))
        }

        return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: "User tidak ditemukan."
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }))
    }
}

const getCheckout = async (req, res) => {
    const { userId } = req.params

    try {
        const checkout = await Checkout.findOne({ user: userId })

        if(checkout) {
            return res.status(200).json(basicResponse({
                status: res.statusCode,
                message: "Success",
                result: checkout
            }))
        }

        return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: "Checkout tidak ditemukan."
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }))
    }
}

const cancelCheckout = async (req, res) => {
    const { userId } = req.params

    try {
        const checkout = await Checkout.findOne({ user: userId })

        if(checkout) {
            await checkout.remove()

            return res.status(202).json(basicResponse({
                status: res.statusCode,
                message: "Checkout berhasil di batalkan."
            }))
        }

        return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: "Checkout tidak ditemukan."
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }))
    }
}

async function find_wingman(req, res) {
    try {
        if (req.user) {
            let { pasar, kota } = req.params;
            let { _id, alamat, no_hp, transaction } = req.user;
            if (!pasar || !kota) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedParams,
                message: `Input Params`
            })
            if (alamat === null) return res.status(403).send({
                status: res.statusCode,
                code: respons.UserNotRegister,
                message: `Alamat null, register first!`
            })
            pasar = pasar.toLowerCase()
            kota = kota.toLowerCase()
            let finds = await User.findOne({ _id })
            let arr = finds.cart;
            let results = { priceTotal: 0, penanganan: 0, ongkir: 10000, total: 0, cart: [] }
            if (Array.isArray(arr) && arr.length) {
                for (let i = 0; i < arr.length; i++ ) {
                    if (arr[i].mark == true) {
                        if (arr[i].type == 'A') {
                            var biaya_penanganan = 1000
                        } else if (arr[i].type == 'B') {
                            var biaya_penanganan = 500
                        } else if (arr[i].type == 'C') {
                            var biaya_penanganan = 250
                        }
                        results.priceTotal += Number(arr[i].price_awal) * Number(arr[i].quantity);
                        results.penanganan += Number(biaya_penanganan) * Number(arr[i].quantity)
                        results.cart.push(arr[i])
                    }
                }
                if (results.penanganan <= 5000) results.penanganan = 5000
                results.total = results.priceTotal + results.penanganan + results.ongkir;
    
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.ProductNotInCart,
                    message: 'Tidak Ada Produk Di Keranjang!'
                })
            }
    
            let find = await Wingman.find({ kota: kota });
            if (Array.isArray(find) && find.length) {
                let Arra = find.map((value, index) => {
                    if (value.available === true)  {
                        if (value.pasar.toLowerCase() == pasar.toLowerCase()) {
                            if (!Array.isArray(value.on_process) && !value.on_process.length) {
                                return value
                            } else {
                                return value
                            }
                        }
                    }
                })
    
                let arr = Arra.filter(Boolean)
                if (Array.isArray(arr) && arr.length) {
                    let filters = arr.filter(item => item.on_process.length < 2);
                    let sort = filters.sort((a, b) => (a.today_order < b.today_order) ? -1 : 1).map((value) => {
                        return { _id: value._id, nama: value.nama, no_hp: value.no_hp, pasar: value.pasar, kota: value.kota, profile: value.profile,
                            today_order: value.today_order, on_process: value.on_process.length, star: value.stars.result }
                    })
                    if (!sort[0]) return res.status(404).send({
                        status: res.statusCode,
                        code: respons.WingmanNotInPasar,
                        message: `Wingman Yang Melayani Pasar ${pasar}, Sedang Memiliki Orderan Semua atau Tidak Tersedia Wingman`
                    })
                    let findOne = await Wingman.findOne({ _id: sort[0]._id });
                    let objTr = { id_order: randomText(24),
                        status: '1', wingman_id: sort[0]._id, wingman_hp: findOne.no_hp, user_id: _id, user_hp: no_hp,
                        alamat_user: alamat, bukti: '', order_completed: '', transaction: results
                    }
    
                    findOne.on_process.push(objTr);
                    finds.transaction.push(objTr);
                    let barangFalse = []
                    for (let i = 0; i < finds.cart.length; i++ ) {
                        if (finds.cart[i].mark == false) {
                            barangFalse.push(finds.cart[i])
                        }
                    }
                    let added = await User.updateOne({ _id }, { cart: barangFalse, transaction: finds.transaction })
                    let added2 = await Wingman.updateOne({ _id: sort[0]._id }, { on_process: findOne.on_process })
                    return res.status(200).send({
                        status: res.statusCode,
                        code: respons[200],
                        message: `Sukses Mendapatkan Wingman ${sort[0].no_hp}`,
                        result: {
                            wingman_random: sort[0],
                            transaction: objTr,
                        }
                    })
                } else {
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.WingmanNotInPasar,
                        message: `Wingman Yang Melayani Pasar ${pasar}, Sedang Memiliki Orderan Semua atau Tidak Tersedia Wingman`
                    })
                }
    
            } else {
                res.status(404).send({
                    status: res.statusCode,
                    code: respons.WingmanNotInKota,
                    message: `Wingman Tidak Tersedia di kota ${kota}`
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

async function cancel_order_user(req, res) {
    try {
        if (req.user.type == 'user') {
            let { id_order } = req.params;
            if (!id_order) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedParams,
                message: `Input Params`
            })
            let arr = req.user.transaction
            if (Array.isArray(arr) && arr.length) {
                let index = arr.findIndex(x => x.id_order == id_order);
                if (arr[index].status > 4) return res.status(404).send({
                    status: res.statusCode,
                    code: respons.AccessDenied,
                    message: `Tidak Bisa Membatalkan orderan dengan status 5 keatas (sudah bayar ke atas)`
                })
                let finds = await Wingman.findOne({ _id: arr[index].wingman_id })
                let arr2 = finds.on_process
                let index2 = arr2.findIndex(x => x.id_order == id_order);
                if (index === -1 && index2 === -1) return res.status(404).send({
                    status: res.statusCode,
                    code: respons.IDOrderNotFound,
                    message: `id order not found!`
                })
                let now = arr.filter(item => item.id_order != id_order)
                let now2 = arr2.filter(item => item.id_order != id_order)
                let delWing = await Wingman.updateOne({ _id: arr[index].wingman_id }, { on_process: now2 });
                let delUser = await User.updateOne({ _id: arr[index].user_id }, { transaction: now });
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Delete Order : ${id_order} => Wingman : ${arr[index].wingman_hp}, User : ${arr[index].user_hp}`
                }) 
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.IDOrderNotFound,
                    message: `Kamu Tidak Memiliki Orderan`
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

async function input_saran(req, res) {
    try {
        if (req.user) {
            let { stars, box } = req.body;
            let { id_order } = req.params;
            if (!id_order) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedParams,
                message: `Input Params`
            })
            if (!stars || !box) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedBody,
                message: 'Input body'
            })
            let users = await User.findOne({ _id: req.user._id });
            let index = users.transaction.findIndex(x => x.id_order == id_order);
            if (index !== -1) {
                let find = await Wingman.findOne({ _id: users.transaction[index].wingman_id });
                if (find) {
                    let kotak = find.kotak_saran
                    let bintang = find.stars
                    let push = bintang.stars.findIndex(x => x.star == stars)
                    bintang.stars[push].count += 1;
                    let tempat = { starsTotal: 0, countTotal: 0, result: 0 }
                    bintang.stars.map((value, index) => {
                        tempat.starsTotal += value.star * value.count
                        tempat.countTotal += value.count
                        tempat.result = tempat.starsTotal / tempat.countTotal
                    })
                    bintang.starsTotal = tempat.starsTotal;
                    bintang.countTotal = tempat.countTotal;
                    bintang.result = tempat.result.toFixed(1);
                    kotak.push({ no_hp: req.user.no_hp, saran: box })
                    Wingman.updateOne({ _id: users.transaction[index].wingman_id }, { stars: bintang, kotak_saran: kotak }, function (err, res) {
                        if (err) throw err;
                    })
                    return res.status(200).send({
                        status: res.statusCode,
                        code: respons[200],
                        message: `Sukses add star ${stars} & input saran : ${box}`,
                        result: {
                            stars: bintang,
                            kotak_saran: kotak
                        }
                    })
                } else {
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.WingmanNotFound,
                        message: `Wingman ${users.transaction[index].wingman_hp} Tidak Ditemukan`,
                    })
                }
            } else {
                res.status(404).send({
                    status: res.statusCode,
                    code: respons.IDOrderNotFound,
                    message: `id order not found`
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

async function in_transaction(req, res) {
    try {
        if (req.user) {
            let { transaction } = req.user;
            let { status } = req.body; // waiting, belum dibayar, diterima
            if (!status) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedBody,
                message: 'Input body array'
            })
            if (Array.isArray(status) && status.length) {
                let arr = []
                for (let a = 0; a < status.length; a++) {
                    let filter = transaction.filter(x => x.status == status);
                    for (let i = 0; i < filter.length; i++) {
                        let find = await Wingman.findOne({ _id: filter[i].wingman_id });
                        if (find) {
                            let arrBelanjaan = []
                            for (let j = 0; j < filter[i].transaction.cart.length; j++) {
                                let product = await Product.findOne({ _id: filter[i].transaction.cart[j].id_product });
                                arrBelanjaan.push(product)
                            }
                            let obj = { name_wingman: find.nama, profile_wingman: find.profile, transaction_detail: filter[i], arrBelanjaan }
                            arr.push(obj)
                        }
                    }
                }
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Menampilkan Transaksi`,
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

async function transaction_detail(req, res) {
    try {
        if (req.user) {
            let { id_order } = req.params;
            if (!id_order) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedParams,
                message: `Input Params`
            })
            let find = await User.findOne({ _id: req.user._id });
            if (find) {
                let index = find.transaction.findIndex(x => x.id_order == id_order);
                if (index !== -1) {
                    let click = find.transaction[index];
                    let arrBelanjaan = []
                    for (let j = 0; j < find.transaction[index].transaction.cart.length; j++) {
                        let product = await Product.findOne({ _id: find.transaction[index].transaction.cart[j].id_product });
                        arrBelanjaan.push(product)
                    }
                    let wingman_find = await Wingman.findOne({ _id: find.transaction[index].wingman_id })
                    if (wingman_find) {
                        return res.status(200).send({
                            status: res.statusCode,
                            code: respons[200],
                            message: `Sukses Menampilkan Transaction Detail`,
                            result: {
                                transaction: click,
                                arrBelanjaan,
                                wingman_data: {
                                    name: wingman_find.nama,
                                    profile: wingman_find.profile,
                                }
                            }
                        })
                    } else {
                        return res.status(404).send({
                            status: res.statusCode,
                            code: respons.WingmanNotFound,
                            message: `Wingman ${find.transaction[index].wingman_hp} Tidak Ditemukan`,
                        })
                    }
                } else {
                    res.status(404).send({
                        status: res.statusCode,
                        code: respons.IDOrderNotFound,
                        message: `id order not found`
                    })
                }
    
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.WingmanNotFound,
                    message: `Wingman ${req.user.no_hp} Tidak Ditemukan`,
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

module.exports = {
    checkout,
    getCheckout,
    cancelCheckout,
    find_wingman,
    cancel_order_user,
    in_transaction,
    transaction_detail,
    input_saran
}