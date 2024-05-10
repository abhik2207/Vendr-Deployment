const passport = require("passport");
const nodemailer = require("nodemailer");
const crypto = require('crypto');

exports.isAuth = (req, res, done) => {
    return passport.authenticate('jwt');
}

exports.sanitizeUser = (user) => {
    return {
        id: user.id,
        role: user.role
    }
}

exports.cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2JhYjFhZDY1M2MyMThhMTI4NWUxOSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE1MTg2NDU4fQ.Z9NYetqKuBWEu7veaKm4t_DYFrFk679nT3eB7phe6cE";
    return token;
};

// EMAIL SYSTEM
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "abhikinreallife@gmail.com",
        pass: process.env.MAIL_PASSWORD,
    },
});

exports.sendMail = async function ({ to, subject, text, html }) {
    const info = await transporter.sendMail({
        from: '"Vendr" <abhikinreallife@gmail.com>', // sender address
        to: to,
        subject: subject,
        text: text,
        html: html
    });
    
    return info;
}