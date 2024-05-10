const { User } = require("../model/User");
const crypto = require('crypto');
const { sanitizeUser, sendMail } = require("../services/common");
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    // const user = new User(req.body);
    const SECRET_KEY = 'TOP_SECRET';

    try {
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(
            req.body.password,
            salt,
            310000,
            32,
            'sha256',
            async function (err, hashedPassword) {
                const user = new User({ ...req.body, password: hashedPassword, salt: salt });

                const document = await user.save();

                req.login(sanitizeUser(document), (err) => {
                    if (err) {
                        res.status(400).json(err);
                    }
                    else {
                        const token = jwt.sign(sanitizeUser(document), SECRET_KEY);
                        console.log("~ Created a user!");
                        res
                            .cookie('jwt', token, { expires: new Date(Date.now() + 3600000), httpOnly: true })
                            .status(201)
                            .json(token);
                    }
                });
            }
        );
    }
    catch (err) {
        res.status(400).json(err);
    }
};

exports.loginUser = async (req, res) => {
    const user = req.user;
    res
        .cookie('jwt', req.user.token, { expires: new Date(Date.now() + 3600000), httpOnly: true })
        .status(200)
        .json({ id: user.id, role: user.role });
};

exports.checkAuth = async (req, res) => {
    if (req.user) {
        res.json(req.user);
    }
    else {
        res.sendStatus(401);
    }
};

exports.resetPasswordRequest = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    if (user) {
        const token = crypto.randomBytes(48).toString('hex');
        user.resetPasswordToken = token;
        await user.save();

        const resetPageLink = "https://vendr-deployment.vercel.app/reset-password?token=" + token + "&email=" + email;
        const subject = "Reset your Vendr password";
        const text = "Reset your Vendr password";
        const html = `<p>Click <a href="${resetPageLink}">here</a> to reset your password</p>`;

        if (email) {
            const response = await sendMail({
                to: email,
                subject: subject,
                text: text,
                html: html
            });

            res.json(response);
        }
        else {
            res.sendStatus(400);
        }
    }
    else {
        res.sendStatus(400);
    }
};

exports.resetPassword = async (req, res) => {
    const { email, token, password } = req.body;
    const user = await User.findOne({ email: email, resetPasswordToken: token });

    if (user) {
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(
            req.body.password,
            salt,
            310000,
            32,
            'sha256',
            async function (err, hashedPassword) {
                user.password = hashedPassword;
                user.salt = salt;
                await user.save();

                const subject = "Vendr password reset successful!";
                const text = "Vendr password reset successful!";
                const html = `<p>Vendr password reset successful!`;

                if (email) {
                    const response = await sendMail({
                        to: email,
                        subject: subject,
                        text: text,
                        html: html
                    });

                    res.json(response);
                }
                else {
                    res.sendStatus(400);
                }
            });
    }
    else {
        res.sendStatus(400);
    }
};