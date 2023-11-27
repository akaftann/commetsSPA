import Posgres from '../lib/db.js'
import { hash, verify } from 'argon2'

class UserService{
    constructor(){
        this.sequelize = Posgres.sequelize
    }

    async createUser(userName, email, pass){
        try{
            const ifExists = await this.sequelize.models.User.findOne({where: {email}})
            if(ifExists){
                throw new Error('Such email is already used')
            }
            const user = await this.sequelize.models.User.create({
                userName,
                email,
                password: await hash(pass),
            })
            return user
        }catch(e){
            throw new Error(e.message)
        }
    }

    async getByEmail(email){
        try{
            const user = await this.sequelize.models.User.findOne({where:{email}})
            if(!user){
                throw new Error('User not found')
            }
            return user
        }catch(e){
            throw new Error(e.message)
        }
    }

    async getById(id){
        try{
            const user = await this.sequelize.models.User.findByPk(id)
            if(!user){
                throw new Error('User not found')
            }
            return user
        }catch(e){
            throw new Error(e.message)
        }
    }
}

export default new UserService()