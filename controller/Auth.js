const { User } = require("../model/User");
const crypto = require('crypto');
const { sanitizeUser } = require("../services/common");
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