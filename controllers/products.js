const Product = require("../models/product")


const getAllProducts=async(req,res)=>{
    
    const {name,sort,fields,numericFilters}=req.query

    if(name){
        req.query.name={$regex:req.query.name,$options:'i'}
    }
    const operator={
        '>':'$gt',
        '>=':'$gte',
        '=':'$eq',
        '<':'$lt',
        '<=':'$lte'
    }
    const regex=/\b(<|>|>=|=|<|<=)\b/g
    
    
    if(numericFilters){
        let filters=numericFilters.replace(regex,(match)=>`-${operator[match]}-`)
        const options=['price','rating']
        filters=filters.split(',').forEach((item)=>{
            const [field,operator,value]=item.split('-')
            if(options.includes(field))
            req.query[field]={
                [operator]:value
            }
        })
        
    }
 
   let products = Product.find(req.query)
   if(sort){
    const sortList=sort.split(',').join(' ')
    products=products.sort(sortList)
}
else{
 products = products.sort('createdAt')
}

if(fields){
    const fieldsList=fields.split(',').join(' ') 
    products=products.select(fieldsList) 
}
const page  = (req.query.page) || 1
const limit = (req.query.limit) || 10
const skip=(page-1)*limit
products=products.skip(skip).limit(limit)


 

products=await products
    res.status(200).json({
      products,nBit:products.length
    })
}

module.exports={
    getAllProducts,
    getAllProductsStatic
}