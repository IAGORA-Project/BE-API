const express = require('express');
const jwt = require('jsonwebtoken');
const { Admin } = require('../db/Admin');
const { User } = require('../db/User');
const { Wingman } = require('../db/Wingman');
const router = express.Router();
const { randomText } = require('../lib/function');
const { respons } = require('../lib/setting');

let tokens = ''

router.get('/get-token', (req, res) => {
    try {
        const auth = req.header('auth');
        if (!auth && auth != 'ini rahasia') {
            res.status(403).send({
                status: res.statusCode,
                code: respons.ForbiddenReq,
                message: 'Forbidden'
            })
        } else {
            tokens = randomText(30);
            res.header('sessid', tokens);
            res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: 'Sukses'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
})

function verifyToken(req, res, next) {
    const token = req.header('sessid');
    if (!token) {
        tokens = ''
        return res.status(403).json({
            status: res.statusCode,
            code: respons.AccessDenied,
            message: "Access Denied"
        })
    } else if (token != tokens) {
        tokens = ''
        res.status(403).json({
            status: res.statusCode,
            code: respons.AccessDenied,
            message: "Oops Access Denied"
        })
    } else {
        tokens = ''
        next()
    }
}

async function verifyAdmin(req, res, next) {
    try {
        const auth = req.header('auths');
        if (!auth) {
            return res.status(403).send({
                status: res.statusCode,
                code: respons.AccessDenied,
                message: 'Access Denied'
            })
        } else if (auth != 'iagoraid') {
            return res.status(403).send({
                status: res.statusCode,
                code: respons.AccessDenied,
                message: 'Access Denied'
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function verifJWT(req, res, next) {
    try {
        const jwtToken = req.cookies.jwt;
        const clientType = req.header('client-type');
        if (jwtToken && clientType) {
            jwt.verify(jwtToken, 'created room', async(err, decodeToken) => {
                if (err) {
                    console.log(err.message);
                    res.cookie('jwt', '', { maxAge: 1 });
                    req.isAuthenticated = false
                    return res.status(409).json({
                        status: res.statusCode,
                        code: respons.JWTExpired,
                        message: "expired"
                    })
                } else {
                    req.isAuthenticated = true
                    if (clientType == 'wingman') {
                        const wingman = await Wingman.findById(decodeToken.id);
                        if (wingman == null) {
                            return res.status(401).send({
                                status: res.statusCode,
                                code: respons.NeedLoginWingman,
                                message: 'Login Wingman First!'
                            })
                        } else {
                            req.user = wingman
                            next();
                        }
                    } else if (clientType == 'user') {
                        const users = await User.findById(decodeToken.id);
                        if (users == null) {
                            return res.status(401).send({
                                status: res.statusCode,
                                code: respons.NeedLoginUser,
                                message: 'Login User First!'
                            })
                        } else {
                            req.user = users
                            next();
                        }
                    } else if (clientType == 'admin') {
                        const users = await Admin.findById(decodeToken.id);
                        if (users == null) {
                            return res.status(401).send({
                                status: res.statusCode,
                                code: respons.NeedLoginUser,
                                message: 'Login Admin First!'
                            })
                        } else {
                            req.user = users
                            next();
                        }
                    } else {
                        return res.status(403).json({
                            status: res.statusCode,
                            code: respons.WrongHeaders,
                            message: "Access Denied Input Type"
                        })
                    }
                    
                }
            })
        } else {
            return res.status(403).json({
                status: res.statusCode,
                code: respons.WrongHeaders,
                message: "Access Denied Wrong Headers"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

module.exports = router
module.exports.verifyToken = verifyToken
module.exports.verifJWT = verifJWT
module.exports.verifyAdmin = verifyAdmin