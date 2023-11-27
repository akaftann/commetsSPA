import { Redis } from 'ioredis'
import { promisify } from 'util'

class clientRedis {
    constructor(){
        this.client = new Redis({
            port: process.env.REDIS_PORT || 6379,
            host: process.env.REDIS_HOST || 'localhost',
        })
        this.client.getAsync = promisify(this.client.get).bind(this.client)
        this.client.setAsync = promisify(this.client.set).bind(this.client)
        this.client.on('error', (err) => {
            console.error(`Redis error: ${err}`)
        })
        this.client.on('connect', () => {
            console.log('Connected to Redis')
        })
    }
}

export default new clientRedis()