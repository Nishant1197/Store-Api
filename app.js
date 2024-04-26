
require('dotenv').config()
require('express-async-errors')

const express=require('express')
const app=express()

const notFoundMiddleware=require('./middleware/not-found')
const errorMiddleware=require('./middleware/error-handler')
const  connectDb = require('./db/connect')
const productRouter=require('./routes/products')
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('<h1>Store Api</h1><a href="/api/v1/products"Products routes</a>')
})

app.use('/api/v1/products',productRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port=process.env.PORT || 7000
const start=async()=>{
try{
   await connectDb(process.env.MONGO_URI)
    app.listen(port,console.log(`Server is listeining port ${port} `))
}
catch(err){
    console.log(err)
}

}
start()
