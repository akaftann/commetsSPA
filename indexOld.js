import express from 'express'
import dotenv from 'dotenv'
import router from './routers.js'
import postgres from './db.js'
dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/',router)

app.get('/',(req,res)=>{
    res.status(200).json('hello user!')
})

const startServer = async () => {
    try{
        await postgres.connect()
        app.listen(PORT, ()=>{
            console.log(`Server started at port: ${PORT}`)
        })
    }catch(e){
        console.log(e)
    }
}

startServer()