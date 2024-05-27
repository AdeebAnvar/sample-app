const express = require('express')
const { addProduct, getAllProducts, getSingleProduct } = require('../controllers/products')
const router = express.Router()
router.post('/addProduct',addProduct)
router.get('/getAllProducts',getAllProducts)
router.get('/:id',getSingleProduct)
module.exports =router