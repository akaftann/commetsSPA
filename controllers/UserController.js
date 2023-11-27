import UserService from '../services/UserService.js'
import { validationResult } from 'express-validator'

class UserController{
    async register(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }
        const {userName, email, pass} = req.body
        try{
            const user = await UserService.createUser(userName, email, pass)
            res.status(201).json('User successfully created')
        }catch(e){
            res.status(500).json({ error: 'Internal Server Error', message: e.message })
        }
        
    }
}
export default new UserController()