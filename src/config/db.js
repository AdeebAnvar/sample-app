const mySql=require('mysql2')
require('dotenv').config()

const pool =mySql.createPool({
    host:process.env.host,
    user:process.env.user,
    password:process.env.password,
    database:process.env.database,
    
})
module.exports=pool