const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'luongduongess@gmail.com',
        pass: 'orjr qvlf nwrt yukv' // Bạn lấy mã này trong cài đặt bảo mật của Google
    }
});

module.exports = transporter;