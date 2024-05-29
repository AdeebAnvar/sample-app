const express = require('express')
const { addToCart, updateCart } = require('../controllers/carts')
const router =express.Router()
router.post('/addToCart',addToCart)
router.post('/updateCart',updateCart)
module.exports=router