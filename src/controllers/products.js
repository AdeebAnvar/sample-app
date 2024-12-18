const pool = require('../config/db.js')
// id
// name
// image
// description
// size
// price
// discount price
// brand logo
// brand
const addProduct = async (req, res) => {
    try {

        const { name, image, price, discountPrice, description, size, brand, brandLogo } = req.body
        if (!name || !image || !description || !size || !brand || !price || !brandLogo) {
            return res.status(404).json({
                message: 'Mandatory fields are missing',
                status: false,
                error: true
            })

        }
        const addProductQuery = 'INSERT INTO product (name,image,price,discountPrice,brandLogo,description,size,brand) VALUES(?,?,?,?,?,?,?,?)'
        const addProductValues = [name, image, price, discountPrice, brandLogo, description, size, brand]
        const result = await pool.promise().query(addProductQuery, addProductValues)
        return res.status(200).json({
            message: 'Succcessfully added',
            status: true,
            error: false
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong",
            status: false,
            error: true
        })
    }

}
const getAllProducts =async(req,res)=>{

    try {
        const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
        const fetchProductsQuery ='SELECT id,name,price,discountPrice,brand,image FROM product '
        const [result] =await pool.promise().query(fetchProductsQuery)
        return res.status(200).json({
            message: "Successfully fetched products",
            status:true,
            error:false,
            result
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong",
            status: false,
            error: true
        })
    }
}
const getSingleProduct =async (req,res)=>{
try {
    const id =req.params.id
    if (!id) {
        return res.status(500).json({
            message: "id is missing",
            status: false,
            error: true
        })
        
    }
    const fetchProductQuery ='SELECT * FROM product WHERE id=?'
    const [result] = await pool.promise().query(fetchProductQuery,id)
    return res.status(200).json({
        message: "Successfully fetched product",
        status:true,
        error:false,
        result
    })
} catch (error) {
    console.log(error)
    return res.status(500).json({
        message: "Something went wrong",
        status: false,
        error: true
    })
}}
const deleteProduct = async (req, res) => {
    try {
      let { productIds } = req.body;
      
      if (!productIds) {
        return res.status(404).json({
          message: "Product id needed",
          status: false,
          error: true,
        });
      }
  
      if (!Array.isArray(productIds)) {
        productIds = [productIds];
      }
  
      console.log(productIds);
  
      const checkProductQuery = "SELECT * FROM product WHERE id IN (?)";
      const [result] = await pool.promise().query(checkProductQuery, [productIds]);
  
      if (result.length === 0) {
        return res.status(404).json({
          message: "Products not found",
          status: false,
          error: true,
        });
      }
  
      const deleteProductQuery = "DELETE FROM product WHERE id IN (?)";
      const [deletedResult] = await pool.promise().query(deleteProductQuery, [productIds]);
      
      console.log(deletedResult);
  
      return res.status(200).json({
        message: "Successfully deleted products",
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
  };
  
module.exports = { addProduct , getAllProducts , getSingleProduct , deleteProduct}