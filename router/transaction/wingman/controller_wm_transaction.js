const { Product } = require("../../../db/Product");
const { User } = require("../../../db/User");
const { Wingman } = require("../../../db/Wingman");
const { respons } = require("../../../lib/setting");

async function accept_order(req, res) {
    try {
        if (req.user) {
            let { _id } = req.user;
            let { status, id_order } = req.query;
            if (!status || !id_order) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedQuery,
                message: "Need Query"
            })
            let find = await Wingman.findOne({ _id });
            if (find) {
                let arr = find.on_process;
                if (Array.isArray(arr) && arr.length) {
                    let index = arr.findIndex(x => x.id_order == id_order);
                    let finds = await User.findOne({ _id: arr[index].user_id })
                    let arr2 = finds.transaction
                    let index2 = arr2.findIndex(x => x.id_order == id_order);
                    if (index !== -1 && index2 !== -1) {
                        if (status == 'true') {
                            arr[index].status = '2'
                            arr2[index2].status = '2'
                            let added = await User.updateOne({ _id: arr[index].user_id }, { transaction: arr2 })
                            let added2 = await Wingman.updateOne({ _id }, { on_process: arr })
                            return res.status(200).send({
                                status: res.statusCode,
                                code: respons[200],
                                message: `Sukses accept order id ${id_order}`,
                                result: {
                                    in_wingman: arr[index],
                                    in_user: arr2[index2]
                                }
                            })
                
                        } else if (status == 'false') {
                            let now = arr.filter(item => item.id_order != id_order)
                            let now2 = arr2.filter(item => item.id_order != id_order)
                            let added = await User.updateOne({ _id: arr[index].user_id }, { transaction: now2 })
                            let added2 = await Wingman.updateOne({ _id }, { on_process: now })
                            return res.status(200).send({
                                status: res.statusCode,
                                code: respons[200],
                                message: `Tolak order id ${id_order}`,
                                result: {
                                    transaction_wingman: now,
                                    transaction_user: now2
                                }
                            })
                        } else {
                            return res.status(403).send({
                                status: res.statusCode,
                                code: respons.WrongQuery,
                                message: 'Wrong status, true / false'
                            })
                        }
                    } else {
                        res.status(404).send({
                            status: res.statusCode,
                            code: respons.IDOrderNotFound,
                            message: `id order not found!`
                        })
                    }   
                } else {
                    res.status(404).send({
                        status: res.statusCode,
                        code: respons.IDOrderNotFound,
                        message: `Kamu Tidak Memiliki Orderan`
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
                code: respons.NeedLoginWingman,
                message: 'Login Wingman First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function in_process(req, res) {
    try {
        if (req.user) {
            let { on_process } = req.user;
            let { status } = req.body;
            if (!status) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedBody,
                message: 'Input body array'
            })
            if (Array.isArray(status) && status.length) {
                let arr = []
                for (let a = 0; a < status.length; a++) {
                    let filter = on_process.filter(x => x.status == status[a]);
                    for (let i = 0; i < filter.length; i++) {
                        let find = await User.findOne({ _id: filter[i].user_id });
                        if (find) {
                            let arrBelanjaan = []
                            for (let j = 0; j < filter[i].transaction.cart.length; j++) {
                                let product = await Product.findOne({ _id: filter[i].transaction.cart[j].id_product });
                                arrBelanjaan.push(product)
                            }
                            let obj = { name: find.nama, profile: find.profile, transaction_detail: filter[i], arrBelanjaan }
                            arr.push(obj)
                        }
                    }
                }
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: 'Sukses Menampilkan Array proses tertentu',
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
                code: respons.NeedLoginWingman,
                message: 'Login Wingman First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function process_order_detail(req, res) {
    try {
        if (req.user) {
            let { id_order } = req.params;
            if (!id_order) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedParams,
                message: `Input Params`
            })
            let find = await Wingman.findOne({ _id: req.user._id });
            if (find) {
                let index = find.on_process.findIndex(x => x.id_order == id_order);
                if (index !== -1) {
                    let click = find.on_process[index];
                    let arrBelanjaan = []
                    for (let j = 0; j < find.on_process[index].transaction.cart.length; j++) {
                        let product = await Product.findOne({ _id: find.on_process[index].transaction.cart[j].id_product });
                        arrBelanjaan.push(product)
                    }
                    let user_find = await User.findOne({ _id: find.on_process[index].user_id })
                    return res.status(200).send({
                        status: res.statusCode,
                        code: respons[200],
                        message: `Sukses Menampilkan Process Order ${id_order}`,
                        result: {
                            transaction: click,
                            arrBelanjaan,
                            user_data: {
                                name: user_find.nama,
                                profile: user_find.profile,
                            }
                        }
                    })
                } else {
                    res.status(404).send({
                        status: res.statusCode,
                        code: respons.IDOrderNotFound,
                        message: `id order not found!`
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
                code: respons.NeedLoginWingman,
                message: 'Login Wingman First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function menawar(req, res) {
    try {
        if (req.user) {
            let { harga_produk, penanganan, ongkir } = req.body;
            let { id_order } = req.params;
            if (!id_order) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedParams,
                message: `Input Params`
            })
            if (!harga_produk || !penanganan || !ongkir) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedBody,
                message: "Input Body"
            })
            let find = await Wingman.findOne({ _id: req.user._id });
            if (find) {
                let barang = find.on_process.findIndex(x => x.id_order == id_order)
                if (barang !== -1) {
                    if (Array.isArray(harga_produk) && harga_produk.length) {
                        let on_p = find.on_process
                        on_p[barang].status = '3'
                        let cart = on_p[barang].transaction.cart
                        if (harga_produk.length != cart.length) return res.status(403).send({
                            status: res.statusCode,
                            code: respons.WrongBody,
                            message: 'banyak body array dan banyak cart harus sama'
                        })
                        on_p[barang].transaction.penanganan = Number(penanganan)
                        on_p[barang].transaction.ongkir = Number(ongkir)
                        on_p[barang].transaction.priceTotal = 0
                        for (let i = 0; i < cart.length; i++) {
                            cart[i].price_awal = Number(harga_produk[i])
                            on_p[barang].transaction.priceTotal += Number(cart[i].price_awal) * Number(cart[i].quantity);
                        }
                        on_p[barang].transaction.total = Number(on_p[barang].transaction.priceTotal) + Number(on_p[barang].transaction.penanganan) + Number(on_p[barang].transaction.ongkir);
                        
                        let findUser = await User.findOne({ _id: on_p[barang].user_id });
                        let transaksiUser = findUser.transaction
                        let indexTransaksiUser = transaksiUser.findIndex(x => x.id_order == id_order);
                        transaksiUser[indexTransaksiUser] = on_p[barang]
                        
                        let added = await Wingman.updateOne({ _id: req.user._id }, { on_process: on_p })
                        let added2 = await User.updateOne({ _id: on_p[barang].user_id }, { transaction: transaksiUser })
                        return res.status(200).send({
                            status: res.statusCode,
                            code: respons[200],
                            message: `Sukses Menawar`,
                            result: on_p[barang]
                        })
                    } else {
                        res.status(404).send({
                            status: res.statusCode,
                            code: respons.WrongBody,
                            message: `empty array`
                        })
                    }
                } else {
                    res.status(404).send({
                        status: res.statusCode,
                        code: respons.IDOrderNotFound,
                        message: `id order not found!`
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
                code: respons.NeedLoginWingman,
                message: 'Login Wingman First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function add_product_tawar(req, res) {
    try {
        if (req.user) {
            let { id_product, id_order, quantity, price_awal } = req.body;
            if (!id_order || !id_product || !quantity || !price_awal) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedBody,
                message: `Input Body`
            })
            let { _id } = req.user;
            let find = await Wingman.findOne({ _id });
            if (find) {
                let { on_process } = req.user;
                if (Array.isArray(on_process) && on_process.length) {
                    let index = on_process.findIndex(x => x.id_order == id_order);
                    if (index !== -1) {
                        let arr = on_process
                        let trans = arr[index].transaction
                        let findProduct = await Product.findOne({ _id: id_product });
                        if (Number(price_awal) < 1000 || Number(price_awal) > Number(Buffer.from(findProduct.product_price, 'hex').toString('utf8'))) return res.status(403).send({
                            status: res.statusCode,
                            code: respons.WrongBody,
                            message: `Price is too high or low`
                        })
                        if (findProduct) {
                            trans.cart.push({
                                id_product, quantity, price_awal, name: Buffer.from(findProduct.product_name, 'hex').toString('utf8'),
                                uom: Buffer.from(findProduct.product_uom, 'hex').toString('utf8'),
                                type: Buffer.from(findProduct.product_grade, 'hex').toString('utf8'), mark: true,
                                image: findProduct.product_image,
                            })
                            let cart = trans.cart;
                            let results = { priceTotal: 0, penanganan: 0, ongkir: trans.ongkir, total: 0, cart }
                            if (Array.isArray(cart) && cart.length) {
                                for (let i = 0; i < cart.length; i++ ) {
                                    if (cart[i].mark == true) {
                                        if (cart[i].type == 'A') {
                                            var biaya_penanganan = 1000
                                        } else if (cart[i].type == 'B') {
                                            var biaya_penanganan = 500
                                        } else if (cart[i].type == 'C') {
                                            var biaya_penanganan = 250
                                        }
                                        results.penanganan += Number(biaya_penanganan) * Number(cart[i].quantity)
                                        results.priceTotal += Number(cart[i].price_awal) * Number(cart[i].quantity);
                                    }
                                }
                            }
                            if (results.penanganan <= 5000) results.penanganan = 5000;
                            results.total = results.priceTotal + results.penanganan + results.ongkir;
                            arr[index].transaction = results;

                            let findUser = await User.findOne({ _id: arr[index].user_id });
                            let transaksiUser = findUser.transaction
                            let indexTransaksiUser = transaksiUser.findIndex(x => x.id_order == id_order);
                            transaksiUser[indexTransaksiUser] = arr[index]

                            let added = await Wingman.updateOne({ _id }, { on_process: arr })
                            let added2 = await User.updateOne({ _id: arr[index].user_id }, { transaction: transaksiUser})
                            return res.status(200).send({
                                status: res.statusCode,
                                code: respons[200],
                                message: `Sukses add ${id_product} ke cart!`,
                                result: {
                                    in_wingman: trans.cart,
                                    transaction: arr[index]
                                }
                            })
                        } else {
                            return res.status(404).send({
                                status: res.statusCode,
                                code: respons.ProductNotInCart,
                                message: 'id product not found!'
                            }) 
                        }
                    } else {
                        return res.status(404).send({
                            status: res.statusCode,
                            code: respons.IDOrderNotFound,
                            message: 'id order not found!'
                        }) 
                    }
                } else {
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.WingmanNoProcess,
                        message: 'on process = 0'
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
                code: respons.NeedLoginWingman,
                message: 'Login Wingman First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function delete_product_tawar(req, res) {
    try {
        if (req.user) {
            let { id_product, id_order } = req.params;
            if (!id_order || !id_product) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedParams,
                message: `Input Params`
            })
            let { _id } = req.user;
            let find = await Wingman.findOne({ _id });
            if (find) {
                let { on_process } = req.user;
                if (Array.isArray(on_process) && on_process.length) {
                    let index = on_process.findIndex(x => x.id_order == id_order);
                    if (index !== -1) {
                        let arr = on_process
                        let trans = arr[index].transaction
                        let now = trans.cart.filter(item => item.id_product != id_product);
                        trans.cart = now;
                        let cart = trans.cart;
                        let results = { priceTotal: 0, penanganan: 0, ongkir: trans.ongkir, total: 0, cart }
                        if (Array.isArray(cart) && cart.length) {
                            for (let i = 0; i < cart.length; i++ ) {
                                if (cart[i].mark == true) {
                                    if (cart[i].type == 'A') {
                                        var biaya_penanganan = 1000
                                    } else if (cart[i].type == 'B') {
                                        var biaya_penanganan = 500
                                    } else if (cart[i].type == 'C') {
                                        var biaya_penanganan = 250
                                    }
                                    results.penanganan += Number(biaya_penanganan) * Number(cart[i].quantity)
                                    results.priceTotal += Number(cart[i].price_awal) * Number(cart[i].quantity);
                                }
                            }
                            if (results.penanganan <= 5000) results.penanganan = 5000;
                            results.total = results.priceTotal + results.penanganan + results.ongkir;
                            arr[index].transaction = results;
                        } else {
                            trans.priceTotal = 0;
                            trans.penanganan = 0;
                            trans.total = 0;
                        }

                        let findUser = await User.findOne({ _id: arr[index].user_id });
                        let transaksiUser = findUser.transaction
                        let indexTransaksiUser = transaksiUser.findIndex(x => x.id_order == id_order);
                        transaksiUser[indexTransaksiUser] = arr[index]

                        let added = await Wingman.updateOne({ _id }, { on_process: arr })
                        let added2 = await User.updateOne({ _id: arr[index].user_id }, { transaction: transaksiUser })
                        return res.status(200).send({
                            status: res.statusCode,
                            code: respons[200],
                            message: `Remove ${id_product}`,
                            result: arr[index]
                        })
                    } else {
                        return res.status(404).send({
                            status: res.statusCode,
                            code: respons.IDOrderNotFound,
                            message: 'id order not found!'
                        }) 
                    }
                } else {
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.WingmanNoProcess,
                        message: 'on process = 0'
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
                code: respons.NeedLoginWingman,
                message: 'Login Wingman First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function edit_quantity_tawar(req, res) {
    try {
        if (req.user) {
            let { id_product, id_order, quantity } = req.body;
            if (!id_product || !id_order || !quantity) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedBody,
                message: `Input Body`
            })
            let { _id } = req.user;
            let find = await Wingman.findOne({ _id });
            if (find) {
                let { on_process } = req.user;
                if (Array.isArray(on_process) && on_process.length) {
                    let index = on_process.findIndex(x => x.id_order == id_order);
                    if (index == -1) return res.status(404).send({
                        status: res.statusCode,
                        code: respons.IDOrderNotFound,
                        message: 'id order not found!'
                    }) 
                    let arr = on_process
                    let trans = arr[index].transaction
                    let now = trans.cart.findIndex(item => item.id_product == id_product);
                    if (now !== -1) {
                        trans.cart[now].quantity = quantity;
                        let cart = trans.cart;
                        let results = { priceTotal: 0, penanganan: 0, ongkir: trans.ongkir, total: 0, cart: cart }
                        if (Array.isArray(cart) && cart.length) {
                            for (let i = 0; i < cart.length; i++ ) {
                                if (cart[i].mark == true) {
                                    if (cart[i].type == 'A') {
                                        var biaya_penanganan = 1000
                                    } else if (cart[i].type == 'B') {
                                        var biaya_penanganan = 500
                                    } else if (cart[i].type == 'C') {
                                        var biaya_penanganan = 250
                                    }
                                    results.penanganan += Number(biaya_penanganan) * Number(cart[i].quantity)
                                    results.priceTotal += Number(cart[i].price_awal) * Number(cart[i].quantity);
                                }
                            }
                        }
                        if (results.penanganan <= 5000) results.penanganan = 5000;
                        results.total = results.priceTotal + results.penanganan + results.ongkir;
                        arr[index].transaction = results

                        let findUser = await User.findOne({ _id: arr[index].user_id });
                        let transaksiUser = findUser.transaction
                        let indexTransaksiUser = transaksiUser.findIndex(x => x.id_order == id_order);
                        transaksiUser[indexTransaksiUser] = arr[index]

                        let added = await Wingman.updateOne({ _id }, { on_process: arr })
                        let added2 = await User.updateOne({ _id: arr[index].user_id }, { transaction: transaksiUser })
                        return res.status(200).send({
                            status: res.statusCode,
                            code: respons[200],
                            message: `Sukses Update quantity Product ${id_product}`,
                            result: arr[index]
                        })
                    } else {
                        return res.status(404).send({
                            status: res.statusCode,
                            code: respons.ProductNotInCart,
                            message: 'id product not found!'
                        }) 
                    }
                } else {
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.WingmanNoProcess,
                        message: 'on process = 0'
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
                code: respons.NeedLoginWingman,
                message: 'Login Wingman First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function change_status(req, res) {
    try {
        if (req.user) {
            let { id_order } = req.params;
            let { status } = req.query;
            if (!id_order) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedParams,
                message: `Input Params`
            })
            if (!status) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedQuery,
                message: `Input Query`
            })
            if (Number(status) < 6) return res.status(403).send({
                status: res.statusCode,
                code: respons.WrongQuery,
                message: `Forbidden Change Status under 6`
            })
            let find = await Wingman.findOne({ _id: req.user._id });
            if (find) {
                let index = find.on_process.findIndex(x => x.id_order == id_order);
                if (index !== -1) {
                    let orderan = find.on_process
                    // if (Number(status) == 8) {
                    //     if (orderan[index].status == 7) {

                    //     }
                    //     return
                    // }
                    orderan[index].status = status

                    let findUser = await User.findOne({ _id: orderan[index].user_id });
                    let transaksiUser = findUser.transaction
                    let indexTransaksiUser = transaksiUser.findIndex(x => x.id_order == id_order);
                    transaksiUser[indexTransaksiUser] = orderan[index]

                    let added = await Wingman.updateOne({ _id: req.user._id }, { on_process: orderan })
                    let added2 = await User.updateOne({ _id: orderan[index].user_id }, { transaction: transaksiUser })
                    return res.status(200).send({
                        status: res.statusCode,
                        code: respons[200],
                        message: `change status ke ${status}`,
                        result: orderan[index],
                    })
                } else {
                    return res.status(404).send({
                        status: res.statusCode,
                        code: respons.IDOrderNotFound,
                        message: 'id order not found!'
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
                code: respons.NeedLoginWingman,
                message: 'Login Wingman First!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

module.exports = {
    accept_order,
    in_process,
    process_order_detail,
    menawar,
    add_product_tawar,
    delete_product_tawar,
    edit_quantity_tawar,
    change_status
}