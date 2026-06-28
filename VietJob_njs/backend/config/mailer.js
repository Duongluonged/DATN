const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'luongduongess@gmail.com',
        pass: 'orjr qvlf nwrt yukv'
    }
});

module.exports = transporter;