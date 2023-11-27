import Posgres from '../lib/db.js'
import redis from 'redis'
import util from 'util'
import { promisify } from 'util'
import clientRedis from '../lib/redis.js'

class CommentService{
    constructor(){
        this.sequelize = Posgres.sequelize
    }
    async create(userName, text, attachedFile = null, replyId = null){
        try{
            const comment = await this.sequelize.models.Comment.create({
                userName,
                text,
                replyId,
                attachedFile,
            })
            return comment
        }catch(e){
            throw new Error(e.message)
        }
    }

    async createReply(userId, parentCommentId, text, attachedFile = null){
        try{
            const parentComment = await this.sequelize.models.Comment.findByPk(parentCommentId)
            if(!parentComment){
                throw new Error('Error, main commend not found')
            }
            const reply = await this.sequelize.models.Comment.create({
                userName: userId,
                text,
                parentId: parentComment.id,
                attachedFile,
            })
        }catch(e){
            throw new Error(e.message)
        }

    }

    async getMainComments(page = 1, pageSize = 25, sortBy = 'createdAt', sortOrder = 'desc'){
        try{
            const cacheKey = `mainComments:${page}:${pageSize}:${sortBy}:${sortOrder}`;
            let cachedComments;

            try {
                cachedComments = await clientRedis.client.getAsync(cacheKey);
            } catch (redisError) {
                console.error(`Redis error during getAsync: ${redisError}`);
                reconnectToRedis();
            }

            if (cachedComments) {
                return JSON.parse(cachedComments);
            }

            const offset = (page - 1) * pageSize;
            const comments = await this.sequelize.models.Comment.findAll({
                where: { parentId: null },
                offset,
                limit: pageSize,
                order: [[sortBy, sortOrder]],
            });

            try {
                await clientRedis.client.setAsync(cacheKey, JSON.stringify(comments));
            } catch (redisError) {
                console.error(`Redis error during setAsync: ${redisError}`);
            }

            return comments;
        }catch(e){
            throw new Error(e.message)
        }
    }

    async getCommentById(commentId) {
        try {
            const comment = await this.sequelize.models.Comment.findByPk(commentId, {
                attributes: { exclude: ['parentId'] }
            })
    
            const repliesObj = {}
            const replies = await this.getReplies(comment, repliesObj)
    
            const result = {
                ...comment.dataValues,
                level: 0,
                replies: replies || []
            }
    
            return result
        } catch (e) {
            throw new Error(e)
        }
    }
    
    async getReplies(comment, repliesObj, level = 0) {
        try {
            comment.level = level
    
            if (!repliesObj[level]) {
                repliesObj[level] = []
            }
    
            const replies = await comment.getReplies({
                attributes: { exclude: ['parentId'] }
            })
    
            if (replies.length === 0) {
                return []
            }
    
            const promises = replies.map(async (repl) => {
                const res = await this.getReplies(repl, repliesObj, level + 1)
                repliesObj[level].push({ ...repl.dataValues, replies: res })
                return repl
            })
    
            await Promise.all(promises)
    
            return repliesObj[level]
        } catch (e) {
            throw new Error(e)
        }
    }
}
export default new CommentService()