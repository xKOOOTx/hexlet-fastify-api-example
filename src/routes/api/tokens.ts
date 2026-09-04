import * as schemas from '../../db/schema.ts'
import { eq, asc } from 'drizzle-orm'

export default async function (fastify) {
  const db = fastify.db

  fastify.post(
    '/tokens',
    async (request, reply) => {
      const client = await db.query.users.findFirst({
        // Добавить проверку пароля
        where: eq(schemas.users.email, request.body.email),
      })
      fastify.assert.ok(client, 404)
      const token = fastify.jwt.sign(
        { id: client.id, email: client.email },
        { expiresIn: '1h' }, // время протухания
      )
      return reply.code(201)
        .send({ token })
    },
  )
}