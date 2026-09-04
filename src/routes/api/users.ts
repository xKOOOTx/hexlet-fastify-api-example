import { eq, asc } from 'drizzle-orm'
import * as schemas from '../../db/schema.ts'
import { defineHandlers, ensure, getPagingOptions } from '../../lib/utils.ts'

const handlers = defineHandlers({
  async usersIndex(request, reply) {
    const page = request.query?.page ?? 1
    const users = await request.server.db.query.users.findMany({
      orderBy: asc(schemas.users.id),
      ...getPagingOptions(page, 1),
    })

    return reply.code(200).send({ data: users })
  },

  async usersShow(request, reply) {
    const user = await request.server.db.query.users.findFirst({
      where: eq(schemas.users.id, request.params.id),
    })
    ensure(user, 404)

    return reply.code(200).send(user)
  },

  async usersCreate(request, reply) {
    const [user] = await request.server.db.insert(schemas.users)
      .values(request.body)
      .returning()

    return reply.code(201).send(user)
  },

  async usersDelete(request, reply) {
    const [user] = await request.server.db.delete(schemas.users)
      .where(eq(schemas.users.id, request.params.id))
      .returning()
    ensure(user, 404)

    return reply.code(204).send()
  },
})

export default handlers