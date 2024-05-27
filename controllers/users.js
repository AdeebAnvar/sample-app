const pool = require('../config/db.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');

require('events').EventEmitter.defaultMaxListeners = 20;

const secret = process.env.secret
const signUp = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body
        if (!name || !phone || !email || !phone) {
            return res.status(404).json({
                message: 'Missing mandatory fields',
                status: false,
                error: true
            })
        }

        const checkEmailQuery = 'SELECT * FROM user WHERE email = ?';
        const checkingEmail = [email]
        const [response] = await pool.promise().query(checkEmailQuery, checkingEmail)
        if (response.length > 0) {
            res.status(400).send({
                message: 'Sorry, this user already exists',
                status: false,
                error: true
            });
            return;

        }
        console.log('exists')
        const hashedPassword = await bcrypt.hash(password, 10)

        const insertQuery = "INSERT INTO user (name,phone,email,password) VALUES(?,?,?,?)"
        console.log(hashedPassword)
        const values = [name, phone, email, hashedPassword]
        await pool.promise().query(insertQuery, values)
        return res.status(201).json({
            message: "User created successfully",
            status: true,
            error: false
        })
    } catch (error) {
        console.log(`sign up error ${error}`)
        return
    }

}
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {

            res.status(500).json({
                message: "Missing mandatory fields",
                status: false,
                error: true,
            })

            return;
        }
        const checkingUserQuery = 'SELECT * FROM user WHERE email = ?';
        const [response] = await pool.promise().query(checkingUserQuery, [email])

        if (response.length == 0) {

            // console.log(response[0].user_id)
            res.status(500).json({
                message: 'User not found on this mail',
                status: false,
                error: true,
            })
            return;
        }

        const isMatch = await bcrypt.compare(password, response[0].password)
        // console.log(response[0].password)
        // console.log(comaprePasswrod)
        if (!isMatch) {
            res.status(400).json({
                message: "Incorrect Password",
                status: false,
                error: true
            })
            return;
        }
        const user = response[0]

        const tokenPayload = {
            email: user.email,
            userId: user.userId
        }
        const token = await jwt.sign(tokenPayload, secret, { expiresIn: '10d' })
        return res.status(201).send({
            message: 'User logged in successfully',
            token,
            status: true,
            error: false,
        });
    } catch (error) {
        console.log(error);
        return res.status(201).send({
            message: 'Something went wrong',
            token,
            status: false,
            error: true,
        });
    }

}
const otpStore = {

};

const sendOtpViaEmail = async (req, res) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

        const email = req.body
        console.log(email);
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'adeebbinanvar@gmail.com',
              pass: 'Asd@12345',
            },
        }) 
        let mailOptions = {
            from: 'adeebbinanvar@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
          };
        
          await transporter.sendMail(mailOptions);

        return res.status(200).send({
            message: 'send',
            status: true,
            error: false,
        });
    } catch (error) {        
        console.log(error);
        return res.status(404).send({
            message: 'Something went wrong',
            status: false,
            error: true,
        });

    }
}
const sendOtpViaPhoneNumber = async (req, res) => { }

module.exports = { signUp, login, sendOtpViaEmail }