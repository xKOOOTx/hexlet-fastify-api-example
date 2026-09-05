import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import fp from 'fastify-plugin'
import { Pool } from 'pg'
import * as schemas from '../db/schema.ts'
import seed from '../db/seeds.ts'

export default fp(async (fastify) => {
  const connectionString =
    process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL

  const pool = new Pool({ connectionString })
  const db = drizzle(pool, { schema: schemas })

  await pool.query(
    'DROP SCHEMA public CASCADE; DROP SCHEMA IF EXISTS drizzle CASCADE; CREATE SCHEMA public;',
  )
  await migrate(db, { migrationsFolder: 'drizzle' })
  await seed(db)

  fastify.decorate('db', db)
  fastify.decorateRequest('db', {
    getter() {
      return fastify.db
    },
  })
  fastify.addHook('onClose', () => pool.end())
})