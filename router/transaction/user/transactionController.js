const { User } = require("../../../db/User");
const { Cart } = require("../../../db/Cart");
const { basicResponse } = require('../../../utils/basic-response')
const { isValidObjectId } = require('mongoose');
const { Checkout } = require("../../../db/Checkout");
const { Transaction } = require("../../../db/Transaction");

const checkout = async (req, res) => {
    const { tip } = req.body
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
                let products = cart.products
                
                const newCheckout = new Checkout({
                    user: cart.user,
                    products,
                    tip: tip ? tip : 0,
                    total: cart.total,
                    totalHandlingFee: cart.totalHandlingFee
                })
                await newCheckout.save()
                const result = await Checkout.findOne(newCheckout).populate({
                    path: 'user',
                    select: '_id no_hp userDetail'
                })
                await cart.remove()

                return res.status(201).json(basicResponse({
                    status: res.statusCode,
                    message: "Success",
                    result: result
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

    if(!isValidObjectId(userId)) {
        return res.status(400).json(basicResponse({
            status: res.statusCode,
            message: "ID user tidak valid."
        }))
    }

    try {
        const checkout = await Checkout.findOne({ user: userId }).populate({
            path: 'user',
            select: '_id no_hp userDetail'
        }).populate({
            path: 'products.productDetail',
            select: '_id product_name',
        })

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

const transaction = async (req, res) => {
    const { shippingCosts, paymentMethod } = req.body
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
            const checkout = await Checkout.findOne({ user: user._id })
            console.log(user.userDetail.checkoutAddress)

            if(checkout) {
                const transaction = new Transaction({
                    user: user._id,
                    products: checkout.products,
                    tip: checkout.tip,
                    shippingCosts,
                    total: checkout.total,
                    totalHandlingFee: checkout.totalHandlingFee,
                    recipientAddress: user.userDetail.checkoutAddress,    
                    paidDate: null,
                    paymentMethod
                })
                await transaction.save()

                // Old address Hitory
                // const addressHistory = user.userDetail.addressHistories.find(addressHistory => addressHistory === transaction.recipientAddress)

                // if(!addressHistory) {
                //     user.userDetail.addressHistories.push(transaction.recipientAddress)
                //     await user.save()
                // }
                
                await checkout.remove()

                return res.status(201).json(basicResponse({
                    status: res.statusCode,
                    message: "Success",
                    result: transaction
                }))
            }

            return res.status(404).json(basicResponse({
                status: res.statusCode,
                message: "Anda belum melakukan checkout."
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


module.exports = {
    checkout,
    getCheckout,
    cancelCheckout,
    transaction
}