import { eq, asc } from 'drizzle-orm'
import * as schemas from '../../db/schema.ts'
import { defineHandlers, ensure, getPagingOptions } from '../../lib/utils.ts';

const handlers = defineHandlers({
  async coursesIndex(request, reply) {
    const page = request.query?.page ?? 1
    const courses = await request.server.db.query.courses.findMany({
      orderBy: asc(schemas.courses.id),
      ...getPagingOptions(page, 1),
    })

    return reply.code(200).send({ data: courses })
  },

  async coursesShow(request, reply) {
    const course = await request.server.db.query.courses.findFirst({
      where: eq(schemas.courses.id, request.params.id),
    })
    ensure(course, 404)

    return reply.code(200).send(course)
  },

  async coursesCreate(request, reply) {
    const [course] = await request.server.db.insert(schemas.courses)
      .values(request.body)
      .returning()

    return reply.code(201).send(course)
  },

  async coursesDelete(request, reply) {
    const [course] = await request.server.db.delete(schemas.courses)
      .where(eq(schemas.courses.id, request.params.id))
      .returning()
    ensure(course, 404)

    return reply.code(204).send()
  },
})

export default handlers
