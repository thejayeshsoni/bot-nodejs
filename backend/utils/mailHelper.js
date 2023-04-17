const nodemailer = require("nodemailer");
const QRcode = require("qrcode");
const fs = require('node:fs');
const cloudinary = require("cloudinary");


const mailHelper = async (options) => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: "gmail",
        auth: {
            user: process.env.SMTP_AUTH_USER,
            pass: process.env.SMTP_AUTH_PASS,
        },
    });
    const message = {
        from: '"Jayesh Soni 👻" <sonijayesh12345@gmail.com>', // sender address
        to: options.toEmail, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
        html: options.htmlResponse
    };
    // send mail with defined transport object
    await transporter.sendMail(message);
};

const sendMail = async (req, res) => {
    try {
        const { email, movieTitle, theatreName, seatsBooked, totalPrice } = req.body;

        const qrImageName = `${email.split('@')[0]}.png`;
        const qrImagePath = `/tmp/${email.split('@')[0]}.png`

        const qrcode = QRcode.toFile(qrImagePath, JSON.stringify({ email, movieTitle, theatreName, seatsBooked, totalPrice }), {
            errorCorrectionLevel: 'H',
            type: 'png',
            quality: 1,
            margin: 1
        });

        let result = await cloudinary.v2.uploader.upload(qrImagePath, {
            public_id: qrImageName,
            overwrite: true,
            use_filename: true,
            unique_filename: false,
            folder: "qr-codes"
        });

        fs.unlinkSync(qrImagePath);

        const htmlResponse = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Movie Card</title>
          </head>
          <body>
              <img src="${result.secure_url}" style="display:block;margin:0 auto;" width="100" alt="QR Code">
            <table style="border-collapse: collapse; width: 100%;">
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Movie</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Theatre</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Seats Booked</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Total Price</th>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${movieTitle}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${theatreName}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${seatsBooked}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${totalPrice}</td>
              </tr>
            </table>
          </body>
        </html>
        
        `
        const mail = await mailHelper({
            toEmail: email,
            subject: `Booking confirmation for ${movieTitle}`,
            message: `Your Ticket has been booked successfully..!!`,
            htmlResponse
        });
        res.status(200).json({
            success: true,
            message: `Mail has sent to ${email} successfully..!!`,
            result
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Not able to send Mail..!!",
            error
        });
    }
};

module.exports.sendMail = sendMail;