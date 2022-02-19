module.exports = {
    waApi: process.env.PROD_HOST_WA_API,

    respons: {
        200: `SS200`,
        "ForbiddenReq": `FREQ`,
        "AccessDenied": `ADREQ`,
        "JWTExpired": `JWTE`,
        "WrongHeaders": `WHS`,
        "StillLogin": `SLL`,
        "BothNotFound": `BNFD`,
        "UserNotFound": "UNF",
        "UserNotRegister": "UNR",
        "NeedLoginUser": `NLU`,
        "WingmanNotFound": `WNF`,
        "NeedLoginWingman": `NLW`,
        "WingmanNotRegister": "WNR",
        "InternalServerError": `ISE`,
        "FailInternalReq": `FIR`,
        "FailSendOTP": "FSO",
        "InvalidOTP": "IOTP",
        "NeedBody": `NB0`,
        "NeedBodyHP": `NB1`,
        "WrongBody": `WB0`,
        "NeedQuery": `NQ0`,
        "WrongQuery": `WQ0`,
        "NeedParams": `NP0`,
        "WrongParams": `WP0`,
        "FileNotFound": `FNF`,
        "NotMatch": `NM`,
        "NotSubmitted": `NS`,
        "AlreadyInDB": `AIDB`,
        "ProductNotFound": `PNF`,
        "ProductNotInCart": `PNIC`,
        "ErrMulter": "ERRM",
        "NoSuchFile": "NSFI",
        "RoomNotFound": `RNF`,
        "RoomIsAlready": `RIA`,
        "FailCreateMsg": `FCM`,
        "MsgNotFoundRoom": `MNFR`,
        "MsgNotFound": `MNF`,
        "WingmanNotInPasar": `WNIP`,
        "WingmanNotInKota": `WNIK`,
        "IDOrderNotFound": `IDONF`,
        "WingmanNoProcess": `WNP`,
        "AdminNotFound": `ADNF`,
        "AdminIsRegistered": `ADIR`
    },

    textCS: {
        textAwal: `Hi Apakah Ada Yang Bisa Kami Bantu ?`,
        textCsDua: `Kami akan segera proses keluhan anda. Mohon Menunggu 5-10 Menit` 
    },

    NoCs: [
        "6287715579966"
    ]
}