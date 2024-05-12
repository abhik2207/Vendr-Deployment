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


exports.invoiceTemplate = function (order) {
    return (
        `
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>Email Receipt</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style type="text/css">
                @media screen {
                    @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                    }

                    @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 700;
                        src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                    }
                }

                body,
                table,
                td,
                a {
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                }

                table,
                td {
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                }

                img {
                    -ms-interpolation-mode: bicubic;
                }

                a[x-apple-data-detectors] {
                    font-family: inherit !important;
                    font-size: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                    color: inherit !important;
                    text-decoration: none !important;
                }

                div[style*="margin: 16px 0;"] {
                    margin: 0 !important;
                }

                body {
                    width: 100% !important;
                    height: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }

                table {
                    border-collapse: collapse !important;
                }

                a {
                    color: #1a82e2;
                }

                img {
                    height: auto;
                    line-height: 100%;
                    text-decoration: none;
                    border: 0;
                    outline: none;
                }
            </style>
        </head>

        <body style="background-color: #D2C7BA;">
            <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
                A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
            </div>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" bgcolor="#D2C7BA">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="center" valign="top" style="padding: 36px 24px;">
                                    <a href="https://vendr-deployment.vercel.app/" target="_blank" style="display: inline-block;">
                                        <img src="https://raw.githubusercontent.com/abhik2207/Vendr-Development/main/Possible-Favicons/Final/favicon.png" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center" bgcolor="#D2C7BA">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Thank you for your order!</h1>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center" bgcolor="#D2C7BA">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                    <p style="margin: 0;">Here is a summary of your recent order from Vendr :)</p>
                                    <p style="margin: 0;">Order ID : ${order.id}</p>
                                </td>
                            </tr>
                            <tr>
                                <td align="left" bgcolor="#ffffff"
                                    style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="left" bgcolor="#D2C7BA" width="60%" style="padding: 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong>Items</strong></td>
                                            <td align="left" bgcolor="#D2C7BA" width="20%" style="padding: 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong>Quantity</strong></td>
                                            <td align="left" bgcolor="#D2C7BA" width="20%" style="padding: 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong>Price</strong></td>
                                        </tr>

                                        ${order.items.map(item => `<tr>
                                                <td align="left" width="60%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">${item.product.title} (${item.product.brand[0].toUpperCase() + item.product.brand.slice(1)})</td>
                                                <td align="left" width="20%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">${item.quantity}</td>
                                                <td align="left" width="20%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">$${Math.round(item.product.price * (1-item.product.discountPercentage/100))}</td>
                                            </tr>`
                                        )}
                                        
                                        <tr>
                                            <td align="left" width="60%" style="padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #D2C7BA; border-bottom: 2px dashed #D2C7BA;"><strong>Total</strong></td>
                                            <td align="left" width="20%" style="padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #D2C7BA; border-bottom: 2px dashed #D2C7BA;"><strong>${order.totalItems}</td>
                                            <td align="left" width="20%" style="padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #D2C7BA; border-bottom: 2px dashed #D2C7BA;"><strong>$${order.totalAmount}</strong></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
                        <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="center" valign="top" style="font-size: 0; border-bottom: 3px solid #d4dadf">
                                    <div style="display: inline-block; width: 100%; max-width: 50%; min-width: 240px; vertical-align: top;">
                                        <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px;">
                                            <tr>
                                                <td align="left" valign="top"
                                                    style="padding-bottom: 36px; padding-left: 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                                    <p><strong>Delivery Address</strong></p>
                                                    <p>${order.selectedAddress.name}</p>
                                                    <p>Phone: ${order.selectedAddress.phone}</p>
                                                    <p>${order.selectedAddress.houseNumber}, ${order.selectedAddress.locality}, ${order.selectedAddress.city}</p>
                                                    <p>${order.selectedAddress.city} - ${order.selectedAddress.pinCode}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div style="display: inline-block; width: 100%; max-width: 50%; min-width: 240px; vertical-align: top;">
                                        <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px;">
                                            <tr>
                                            </tr>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>

        </html>
        `
    )
}