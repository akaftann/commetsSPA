import CommentService from '../services/CommentService.js'
import UserService from '../services/UserService.js'
import jwtService from '../services/jwtService.js'
import commentQueue from '../lib/queue.js'

class CommentController{
    async getMains(req,res){
        const token = req.headers.authorization
        if(!token){
            return res.status(401).json({ error: 'Unauthorized', message: 'Token not provided' })
        }
        try{
            const { page = 1, pageSize = 25, sortBy = 'createdAt', sortOrder = 'desc' } = req.query
            const mainComments = await CommentService.getMainComments(page, pageSize, sortBy, sortOrder)
            res.status(200).json(mainComments)
        }catch(e){
            res.status(500).json({ error: 'Internal Server Error', message: e.message })
        }
    }

    async getById(req,res){
        const token = req.headers.authorization
        if(!token){
            return res.status(401).json({ error: 'Unauthorized', message: 'Token not provided' })
        }
        const commentId = req.params.id
        try{
            const comment = await CommentService.getCommentById(commentId)
            res.status(200).json(comment)
        }catch(e){
            res.status(500).json({ error: 'Internal Server Error', message: e.message })
        }
    }

    async create(req, res){
        const token = req.headers.authorization
        if(!token){
            return res.status(401).json({ error: 'Unauthorized', message: 'Token not provided' })
        }
        try{
            const {id} = jwtService.parseToken(token.split(' ')[1])
            const user = await UserService.getById(id)
            const {text, attachedFile} = req.body
            await commentQueue.add('createComment', {
                userName: user.userName,
                text,
                attachedFile,
              })
            res.status(201).json('Сomment successfully created')
        }catch(e){
            res.status(500).json({ error: 'Internal Server Error', message: e.message })
        }
    }

    async createReply(req, res){
        const token = req.headers.authorization
        if(!token){
            return res.status(401).json({ error: 'Unauthorized', message: 'Token not provided' })
        }
        const {id} = jwtService.parseToken(token.split(' ')[1])
        const commentId = req.params.id
        const {text, attachedFile} = req.body
        try{
            const user = await UserService.getById(id)
            const comment = await CommentService.createReply(user.id, commentId, text, attachedFile)
            res.status(201).json('Comment reply successfully created')
        }catch(e){
            res.status(500).json({ error: 'Internal Server Error', message: e.message })
        }
    }
}

export default new CommentController()