import Queue from 'bull';
import CommentService from '../services/CommentService.js';

const commentQueue = new Queue('commentQueue', {
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost',
  },
})

commentQueue.process('createComment', async (job) => {
  const { userName, text, attachedFile } = job.data;
  await CommentService.create(userName, text, attachedFile);
})
