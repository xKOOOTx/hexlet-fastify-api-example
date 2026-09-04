import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import type * as schemas from '../db/schema.ts'

declare module 'fastify' {
  interface FastifyInstance {
    db: BetterSQLite3Database<typeof schemas>
  }
}