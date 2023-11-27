import Posgres from '../lib/db.js'
import { verify } from 'argon2'
import UserService from './UserService.js'
import jwtService from './jwtService.js'

class AuthService{
    async login(email, pass){
        try{
            console.log('start searching user service')
            const user = await UserService.getByEmail(email, pass)
            const isValid = await verify(user.password, pass)
            if(!isValid){
                throw new Error('Invalid password')
            }
            const token = jwtService.generateToken(user.id)
            return token

        }catch(e){
            throw new Error(e.message)
        }
    }
}

export default new AuthService()