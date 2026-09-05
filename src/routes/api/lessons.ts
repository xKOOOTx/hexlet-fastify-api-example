import { eq, asc, count } from 'drizzle-orm'
import * as schemas from '../../db/schema.ts'
import { defineHandlers, ensure, getPagingOptions, serializeTimestamps } from '../../lib/utils.ts'
import LessonSerializer from '../../serializers/LessonSerializer.ts'

const handlers = defineHandlers({
  async lessonsIndex(request, reply) {
    const page = request.query?.page ?? 1
    const perPage = request.query?.perPage ?? 10
    const [{ total }] = await request.db.select({ total: count() }).from(schemas.courseLessons)
    const totalPages = Math.ceil(total / perPage)

    const lessons = await request.db.query.courseLessons.findMany({
      orderBy: asc(schemas.courseLessons.id),
      ...getPagingOptions(page, perPage),
    })

    return reply.code(200).send(LessonSerializer.index(lessons.map(serializeTimestamps), {page, perPage, total, totalPages}))
  },

  async lessonsShow(request, reply) {
    const lesson = await request.db.query.courseLessons.findFirst({
      where: eq(schemas.courseLessons.id, request.params.id),
    })
    ensure(lesson, 404)

    return reply.code(200).send(serializeTimestamps(lesson))
  },

  async lessonsCreate(request, reply) {
    const [lesson] = await request.db.insert(schemas.courseLessons)
      .values(request.body)
      .returning()

    return reply.code(201).send(serializeTimestamps(lesson))
  },

  async lessonsDelete(request, reply) {
    const [lesson] = await request.db.delete(schemas.courseLessons)
      .where(eq(schemas.courseLessons.id, request.params.id))
      .returning()
    ensure(lesson, 404)

    return reply.code(204).send()
  },
})

export default handlers