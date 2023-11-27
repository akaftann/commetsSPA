import express from 'express'
import http from 'http'
import  {Server} from 'socket.io'
import dotenv from 'dotenv'
import router from './routers.js'
import postgres from './lib/db.js'

dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/', router)

app.get('/', (req, res) => {
    res.status(200).json('hello user!')
})

const server = http.createServer(app)

const wss = new Server(server)

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket')

    ws.on('message', (message) => {
        console.log(`Received message from client: ${message}`)
    })

    ws.on('close', () => {
        console.log('Client disconnected from WebSocket')
    })
})

server.listen(PORT, async() => {
    await postgres.connect()
    console.log(`Server started at port: ${PORT}`)
})
