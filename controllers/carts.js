const pool = require('../config/db.js')
const secret = process.env.secret
const jwt = require('jsonwebtoken')

// cart id
// user id
// quantity
const addToCart = async (req, res) => {
    try {
        const { productId, quantity, price } = req.body
        let userId = ''

        console.log('3r31')
        if (!req.headers.authorization) {
            console.log('3r32')
            userId = 0
            return res.status(500).json({
                message: "token not provided",
                status: false,
                error: true,
            });
        } else {
            const token = req.headers.authorization.split(' ')[1];
            console.log(`toke ${token}`)
            const decodedToken = jwt.verify(token, secret);
            userId = decodedToken.userId;
        }   
        if (!productId || !quantity || !price) {
            return res.status(404).json({
                message: "Mandatory fields are missing",
                status: false,
                error: true,
            });
        }

        const checkProductInTable = 'SELECT * FROM product WHERE id = ?'
        const [checkingProductResult] = await pool.promise().query(checkProductInTable, productId)
        if (checkingProductResult.length == 0) {
            return res.status(404).json({
                message: "Product not found",
                status: false,
                error: true,
            });
        }

        const checkingUserInCart = 'SELECT * FROM cart WHERE user_id = ?'
        const [checkingUserInCartResult] = await pool.promise().query(checkingUserInCart, [userId])
        let cartId = ''
        console.log(`checkingUserInCartResult: ${checkingUserInCartResult}`)
        if (checkingUserInCartResult.length == 0) {
            const addUserToCartQuery = "INSERT INTO cart (user_id) VALUES(?)"
            const addUserToCartValues = [userId]
            const [addedUserToCartResult] = await pool.promise().query(addUserToCartQuery, addUserToCartValues)
            console.log(`addedProductsToCartResult : ${addedUserToCartResult}`)
            cartId=addedUserToCartResult[0].cart_id
        }else{

            console.log(`bi : ${checkingUserInCartResult}`)
            cartId=checkingUserInCartResult[0].cart_id
        }

        const addProductCartItem = "INSERT INTO cart_items (cart_id ,product_id,quantity,price) VALUES(?,?, ?, ?)"
        const addProductCartItemValues = [cartId,productId, quantity, price]
        const [addedProductsToCartItemResult] = await pool.promise().query(addProductCartItem, addProductCartItemValues)
        console.log(`addedProductsToCartItemResult : ${addedProductsToCartItemResult}`)

        return res.status(201).json({
            message: "Product Added To Cart",
            status: true,
            error: false,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            status: false,
            error: true,
        });
    }

}

const updateCart = async (req,res)=>{

}

module.exports = { addToCart ,updateCart}