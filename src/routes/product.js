const express = require('express')
const { addProduct, getAllProducts, getSingleProduct, deleteProduct } = require('../controllers/products')
const router = express.Router()
router.post('/addProduct',addProduct)
router.get('/getAllProducts',getAllProducts)
router.get('/:id',getSingleProduct)
router.post('/deleteProduct',deleteProduct)
module.exports =router