const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../db/User');
const { Wingman } = require('../db/Wingman');
const router = express.Router();
const { randomText } = require('../lib/function');

let tokens = ''

router.get('/get-token', (req, res) => {
    try {
        const auth = req.header('auth');
        if (!auth && auth != 'ini rahasia') {
            res.status(403).send({
                status: res.statusCode,
                message: 'Forbidden'
            })
        } else {
            tokens = randomText(30);
            res.header('sessid', tokens);
            res.status(200).send({
                status: res.statusCode,
                message: 'Sukses'
            })
        }
    } catch (error) {
        console.log(error);
    }
})

function verifyToken(req, res, next) {
    const token = req.header('sessid');
    if (!token) {
        tokens = ''
        return res.status(403).json({
            status: res.statusCode,
            message: "Access Denied"
        })
    } else if (token != tokens) {
        tokens = ''
        res.status(403).json({
            status: res.statusCode,
            message: "Oops Access Denied"
        })
    } else {
        tokens = ''
        next()
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
                    req.isAuthenticated = false
                    return res.status(403).json({
                        status: res.statusCode,
                        message: "expired"
                    })
                } else {
                    req.isAuthenticated = true
                    if (clientType == 'wingman') {
                        const wingman = await Wingman.findById(decodeToken.id);
                        if (wingman == null) {
                            return res.status(403).json({
                                status: res.statusCode,
                                message: "login first"
                            })
                        } else {
                            req.user = wingman
                            next();
                        }
                    } else if (clientType == 'user') {
                        const users = await User.findById(decodeToken.id);
                        if (users == null) {
                            return res.status(403).json({
                                status: res.statusCode,
                                message: "login first"
                            })
                        } else {
                            req.user = users
                            next();
                        }
                    } else {
                        return res.status(403).json({
                            status: res.statusCode,
                            message: "Access Denied input type"
                        })
                    }
                    
                }
            })
        } else {
            return res.status(403).json({
                status: res.statusCode,
                message: "Access Denied headers wrong"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(403).json({
            status: res.statusCode,
            message: "expired"
        })
    }
}

module.exports = router
module.exports.verifyToken = verifyToken
module.exports.verifJWT = verifJWT