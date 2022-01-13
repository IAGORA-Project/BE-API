const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

function randomText(len) {
    const result = [];
    for (let i = 0; i < len; i++) result.push(pool[Math.floor(Math.random() * pool.length)]);
    return result.join('');
}

function randomOtp(len) {
    let result = []
    const char = '0123456789'.split('');
    for (let i = 0; i < len; i++) result.push(char[Math.floor(Math.random() * char.length)]);
    return result.join('');
}

module.exports = { randomText, randomOtp }