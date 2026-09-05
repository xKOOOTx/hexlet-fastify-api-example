import type { DrizzleDB } from './index.ts'

declare module 'fastify' {
  interface FastifyInstance {
    db: DrizzleDB
  }

  interface FastifyRequest {
    db: DrizzleDB
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number }
    user: { id: number }
  }
}