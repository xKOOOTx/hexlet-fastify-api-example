import { eq, asc } from 'drizzle-orm'
import * as schemas from '../../db/schema.ts'
import { defineHandlers, ensure, getPagingOptions, serializeTimestamps } from '../../lib/utils.ts'

const handlers = defineHandlers({
  async usersIndex(request, reply) {
    const page = request.query?.page ?? 1
    const users = await request.db.query.users.findMany({
      orderBy: asc(schemas.users.id),
      ...getPagingOptions(page, 1),
    })

    return reply.code(200).send({ data: users.map(serializeTimestamps) })
  },

  async usersShow(request, reply) {
    const user = await request.db.query.users.findFirst({
      where: eq(schemas.users.id, request.params.id),
    })
    ensure(user, 404)

    return reply.code(200).send(serializeTimestamps(user))
  },

  async usersCreate(request, reply) {
    const [user] = await request.db.insert(schemas.users)
      .values(request.body)
      .returning()

    return reply.code(201).send(serializeTimestamps(user))
  },

  async usersDelete(request, reply) {
    const [user] = await request.db.delete(schemas.users)
      .where(eq(schemas.users.id, request.params.id))
      .returning()
    ensure(user, 404)

    return reply.code(204).send()
  },
})

export default handlers