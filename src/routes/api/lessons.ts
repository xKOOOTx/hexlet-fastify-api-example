import { eq, asc } from 'drizzle-orm'
import * as schemas from '../../db/schema.ts'
import { defineHandlers, ensure, getPagingOptions } from '../../lib/utils.ts'

const handlers = defineHandlers({
  async lessonsIndex(request, reply) {
    const page = request.query?.page ?? 1
    const lessons = await request.server.db.query.courseLessons.findMany({
      orderBy: asc(schemas.courseLessons.id),
      ...getPagingOptions(page, 1),
    })

    return reply.code(200).send({ data: lessons })
  },

  async lessonsShow(request, reply) {
    const lesson = await request.server.db.query.courseLessons.findFirst({
      where: eq(schemas.courseLessons.id, request.params.id),
    })
    ensure(lesson, 404)

    return reply.code(200).send(lesson)
  },

  async lessonsCreate(request, reply) {
    const [lesson] = await request.server.db.insert(schemas.courseLessons)
      .values(request.body)
      .returning()

    return reply.code(201).send(lesson)
  },

  async lessonsDelete(request, reply) {
    const [lesson] = await request.server.db.delete(schemas.courseLessons)
      .where(eq(schemas.courseLessons.id, request.params.id))
      .returning()
    ensure(lesson, 404)

    return reply.code(204).send()
  },
})

export default handlers