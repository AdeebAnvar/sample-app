const express = require('express')
const {signUp, login, sendOtpViaEmail}=require('../controllers/users')
const router =express.Router()
router.post('/signup',signUp)
router.post('/login',login)
router.post('/mailOtp',sendOtpViaEmail)
module.exports=router