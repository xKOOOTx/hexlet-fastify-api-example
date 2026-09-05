import { eq, asc, count } from 'drizzle-orm'
import { httpErrors } from '@fastify/sensible'
import * as schemas from '../../db/schema.ts'
import { defineHandlers, ensure, getPagingOptions, serializeTimestamps } from '../../lib/utils.ts'
import { hashPassword } from '../../lib/password.ts'
import UserValidator from '../../validators/UserValidator.ts'

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
    const { password, ...rest } = await UserValidator.validateCreate(request.db, request.body)
    const passwordDigest = await hashPassword(password)

    const [user] = await request.db.insert(schemas.users)
      .values({ ...rest, passwordDigest })
      .returning()

    return reply.code(201).send(serializeTimestamps(user))
  },

  async usersDelete(request, reply) {
    const existing = await request.db.query.users.findFirst({
      where: eq(schemas.users.id, request.params.id)
    })
    ensure(existing, 404)
    const [{ total }] = await request.db
      .select({ total: count() })
      .from(schemas.courses)
      .where(eq(schemas.courses.creatorId, request.params.id))
    
    if (total > 0) {
      throw httpErrors.conflict(`User still owns ${total} course(s)`)
    }
    
    await request.db.delete(schemas.users).where(eq(schemas.users.id, request.params.id))

    return reply.code(204).send()
  },
})

export default handlers