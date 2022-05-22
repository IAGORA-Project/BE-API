// const passport = require('passport');
const jwt = require('jsonwebtoken');
const { default: axios } = require("axios");

const { OneTimePassword } = require("../../db/OneTimePassword");
const { randomOtp } = require("../../lib/function");
const { User } = require('../../db/User');
const { respons, waApi } = require('../../lib/setting');
const { generateRefreshToken, generateAccessToken } = require('../../utils/authentication');
const { basicResponse } = require('../../utils/basic-response');
const { isValidObjectId } = require('mongoose')

async function getAccessToken(req, res) {
    // token obtained from verify otp
    const refreshToken = req.headers['x-refresh-token']
    const decode = jwt.decode(refreshToken.split(' ')[1])
    // get user id from decode
    const userId = decode.jti
    
    //check if the token is valid
    if(!decode.type) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            message: "Token tidak valid."
        }))
    } else if(decode.type !== 'user') {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            message: "Token tidak dikenali."
        }))
    }

    // generate access token for 1 day period
    try {
        const user = await User.findById(userId)
        const baseUrl = `${req.protocol}://${req.hostname}`

        if(user) {
            const accessToken = generateAccessToken(user._id, user.no_hp, 'user', baseUrl)

            return res.status(200).json(basicResponse({
                status: res.statusCode,
                message: "Access token akan expire dalam 24 jam.",
                result: { accessToken }
            }))
        }

        return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: "User tidak ditemukan!"
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }))
    }
}

async function getUserData(req, res) {
    //get access token and its user id
    const accessToken = req.headers['x-access-token']
    const decode = jwt.decode(accessToken.split(' ')[1])
    const userId = decode.jti

    //get user data
    try {
        const user = await User.findById(userId)

        if(user) {
            return res.status(200).json(basicResponse({
                status: res.statusCode,
                message: "Success!",
                result: user
            }))
        }

        return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: "User not found!"
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }));
    }
}

async function updateUserData(req, res) {
    const { name, email, address } = req.body
    const avatar = req.file

    // check if email data is in correct format
    const isEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
    if(email) {
        if(!isEmail) {
            return res.status(400).json(basicResponse({
                status: res.statusCode,
                message: "Email tidak valid!"
            }))
        }
    }

    const accessToken = req.headers['x-access-token']
    const decode = jwt.decode(accessToken.split(' ')[1])
    const userId = decode.jti

    try {
        const user = await User.findById(userId)

        if(user) {
            const oldUserData = {
                name: user.userDetail.name,
                email: user.userDetail.email,
                address: user.userDetail.address,
                avatar: user.userDetail.avatar
            }

            const updateUser = await User.findByIdAndUpdate(user._id, {
                $set: {
                    userDetail: {
                        name: name ? name : oldUserData.name,
                        email: email ? email : oldUserData.email,
                        address: address ? address : oldUserData.address,
                        avatar: avatar ? avatar.filename : oldUserData.avatar
                    }
                }
            }, { new: true })

            return res.status(200).json(basicResponse({
                status: res.statusCode,
                message: "Success!",
                result: updateUser
            }))
        }

        return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: "User not found!"
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }));
    }
}

async function send_otp_user(req, res) {
    try {
        //check if phone number format is correct or not
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
                        const refreshToken = generateRefreshToken(user._id, user.no_hp, 'user', baseUrl)
                        return res.status(200).json(basicResponse({
                            status: res.statusCode,
                            message: 'Varifikasi berhasil!',
                            result: {
                                userId: user._id,
                                isComplateRegister: !user.userDetail.name ? false : true,
                                refreshToken
                            }
                        }))
                    }

                    // Jika belum maka buat user baru
                    const createNewUser = await User.create({ type: 'User', no_hp })
                    const refreshToken = generateRefreshToken(createNewUser._id, createNewUser.no_hp, 'user', baseUrl)

                    return res.status(200).json(basicResponse({
                        status: res.statusCode,
                        message: 'Verifikasi berhasil!',
                        result: {
                            userId: createNewUser._id,
                            isComplateRegister: !createNewUser.userDetail.name ? false : true,
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

async function completeRegistration(req, res) {
    const { name, email } = req.body
    const { userId } = req.params

    if(!isValidObjectId(userId)) {
        return res.status(400).json(basicResponse({
            status: res.statusCode,
            message: "ID user tidak valid!"
        }))
    }
    
    try {
        const user = await User.findById(userId)
        //check the environment
        const baseUrl = `${req.protocol}://${req.hostname}${process.env.NODE_ENV === 'development' ? ':' + 5050 : ''}`

        if(user) {
            const updatedUser = await User.findByIdAndUpdate(user._id, {
                $set: {userDetail: {
                    name, email, avatar: `${baseUrl}/image/user/default.png`
                }}
            }, { new: true })

            return res.status(200).json(basicResponse({
                status: res.statusCode,
                message: "Data anda berhasil dilengkapi.",
                result: updatedUser
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

async function addAddress(req, res) {
    const data = req.body
    
    const accessToken = req.headers['x-access-token']
    const decode = jwt.decode(accessToken.split(' ')[1])
    const userId = decode.jti

    try {
        const user = await User.findById(userId)

        if(user) {
            // add the address to the array
            const result = await User.findOneAndUpdate(
                { _id: userId }, 
                { $push: { "userDetail.addressHistories": data } },
                {new: true}
            );

            return res.status(200).json(basicResponse({
                status: res.statusCode,
                message: "Success!",
                result: result
            }))
        }

        return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: "User not found!"
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }));
    }
}

async function deleteAddress(req, res) {
    const {addressId} = req.body
    
    const accessToken = req.headers['x-access-token']
    const decode = jwt.decode(accessToken.split(' ')[1])
    const userId = decode.jti

    try {
        const user = await User.findById(userId)

        if(user) {

            // pull the specific address (by address id)
            const result = await User.findOneAndUpdate(
                { _id: userId }, 
                { $pull: { "userDetail.addressHistories":  {"_id": addressId} }},
                {new: true}
            );

            return res.status(200).json(basicResponse({
                status: res.statusCode,
                message: "Success!",
                result: result
            }))
        }

        return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: "User not found!"
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }));
    }
}

async function setCheckoutAddress(req, res) {
    const {addressId} = req.body
    
    const accessToken = req.headers['x-access-token']
    const decode = jwt.decode(accessToken.split(' ')[1])
    const userId = decode.jti

    try {
        // get yser data
        const user = await User.findById(userId)

        if(user) {
            //get entire address object from its id
            const address = user.userDetail.addressHistories.id(addressId)
            
            // update checkout address from the obtained object
            const result = await User.findOneAndUpdate(
                { _id: userId }, 
                { $set: { "userDetail.checkoutAddress":  address }},
                {new: true}
            );

            return res.status(200).json(basicResponse({
                status: res.statusCode,
                message: "Success!",
                result: result
            }))
        }

        return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: "User not found!"
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }));
    }
}

async function delete_one_user(req, res) {
    const {userId} = req.params
    
    const accessToken = req.headers['x-access-token']
    const decode = jwt.decode(accessToken.split(' ')[1])
    const userIdConfirm = decode.jti
    
    //checks if wingmanId in token is the same as wingmanId in params
    if (userId === userIdConfirm) {
        try {
            await User.deleteOne({_id: userId});
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: 'Success delete one user account'
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
        }
    }

    // Jika wingmanId tidak cocok, maka muncul error
    return res.status(403).json(basicResponse({
        status: res.statusCode,
        message: "UserId antara params dan token tidak cocok!"
    }))   
}

module.exports = {
    getAccessToken,
    getUserData,
    updateUserData,
    send_otp_user,
    verifyOtp,
    completeRegistration,
    addAddress,
    deleteAddress,
    setCheckoutAddress,
    delete_one_user
}