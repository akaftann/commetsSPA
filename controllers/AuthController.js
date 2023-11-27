import AuthService from "../services/AuthService.js";
import { validationResult } from 'express-validator'

class AuthController{
    async login(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }
        const {email, pass} = req.body
        try{
            const token = await AuthService.login(email, pass)
            res.status(200).json({ email: email, token: token })
        }catch(e){
            res.status(401).json({ error: 'Unauthorized', message: e.message })
        }
    }
}

export default new AuthController()