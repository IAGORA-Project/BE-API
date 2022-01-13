const LocalStrategy = require('passport-local').Strategy;
const { Wingman } = require('../db/Wingman');
const { User } = require('../db/User');

module.exports = function(passport) {
    passport.use('wingman', new LocalStrategy({
        passReqToCallback: true
    },(req, username, password, done) => {
            Wingman.findOne({no_hp: username}).then(async(wingman) => {
                if (wingman == null) {
                    const now = await Wingman.create({
                        type: 'wingman',
                        no_hp: username,
                        nama: null, file: null, email: null, alamat: null, kota: null, pasar: null, bank: null, no_rek: null, nama_rek: null,
                        ktp: null, skck: null, available: true, stars: 0, today_order: 0, total_order:  0, income: 0, on_process: []
                    })
                    return done(null, now);
                } else {
                    return done(null, wingman);
                }
            })
        })
    );

    passport.use('user', new LocalStrategy({
        passReqToCallback: true
    },(req, username, password, done) => {
            User.findOne({no_hp: username}).then(async(user) => {
                if (user == null) {
                    const now = await User.create({
                        type: 'user',
                        no_hp: username,
                        nama: null, profile: null, email: null, alamat: null, cart: []
                    })
                    return done(null, now);
                } else {
                    return done(null, user);
                }
            })
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, { id: user.id, type: user.type });
    });
    
    passport.deserializeUser(function (obj, done) {
        switch (obj.type) {
            case 'wingman':
                Wingman.findById(obj.id).then(user => {
                        if (user) {
                            done(null, user);
                        } else {
                            done(new Error('(wingman) user id not found:' + obj.id, null));
                        }
                    });
                break;
            case 'user':
                User.findById(obj.id).then(user => {
                    if (user) {
                        done(null, user);
                    } else {
                        done(new Error('(user) user id not found:' + obj.id, null));
                    }
                });
                break;
            default:
                done(new Error('no entity type:', obj.type), null);
                break;
        }
    });
}