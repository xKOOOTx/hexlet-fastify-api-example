import type { DrizzleDB } from './index.ts'

declare module 'fastify' {
  interface FastifyInstance {
    db: DrizzleDB
  }

  interface FastifyRequest {
    db: DrizzleDB
  }
}