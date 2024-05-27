/* to start a node project , navigate to the respected directory and 
type npm init and npm install express to install package.json 
npm install nodemon also
npm isntall dot env also
 and node modules and package .lock files

 additionally manually create an app.js and .env file and 3 folders which controllers , routes and config

 */
const express = require('express')
const userRoutes=require('./routes/user.js')
const productRoutes=require('./routes/product.js')
const cartRoutes=require('./routes/cart.js')
const bodyParser =require('body-parser')

require('dotenv').config()

const app = express()
const port = process.env.port || 1010
app.use(bodyParser.json())
app.use('/user', userRoutes)
app.use('/product', productRoutes)
app.use('/cart', cartRoutes)
app.listen(port, function () {
    console.log(`server listening... at ${port}`)
})