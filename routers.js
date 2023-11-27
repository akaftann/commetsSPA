import Router from 'express'
import UserController from './controllers/UserController.js'
import AuthController from './controllers/AuthController.js'
import CommentController from './controllers/CommentController.js'
import {check} from 'express-validator'



const router = new Router()
router.post('/register', check('userName', 'username field can\'t be empty').notEmpty(),
    check('pass', 'password lenght should be between 4 and 10 symbols').isLength({min:4,max:10}), 
    UserController.register)
router.post('/login', check('email', 'username field can\'t be empty').notEmpty(),
    check('pass', 'password lenght should be between 4 and 10 symbols').isLength({min:4,max:10}), 
    AuthController.login)
router.route('/comments')
    .post(CommentController.create)  
    .get(CommentController.getMains)
router.route('/comments/:id')
    .post(CommentController.createReply)
    .get(CommentController.getById)


export default router