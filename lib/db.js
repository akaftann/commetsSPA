import dotenv from 'dotenv'
import config from '../config/index.js'
import { Sequelize } from 'sequelize'
import models from '../models/index.js'
dotenv.config()
const enviropment = process.env.NODE_ENV || 'development'

class Postgres{
    constructor(){
        this.sequelize = new Sequelize(config[enviropment].posgres.options)
        this.client = null
        this.log = config[enviropment].log()
    }

    async connect(){
        try{
            this.client = await this.sequelize.authenticate()
            this.log.info('connection established successfully')
            models(this.sequelize)
        }catch(e){
            this.log.error('unable to connect db', e)
        }
    }
}
export default new Postgres()
