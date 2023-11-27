import Queue from 'bull';

const commentQueue = new Queue('commentQueue', {
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost',
  },
})

export default commentQueue
