import jwtPlugin from '@fastify/jwt'
import fp from 'fastify-plugin'

export default fp(async (fastify) => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not set')
  }

  fastify.register(jwtPlugin, { secret })
})