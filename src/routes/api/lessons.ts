import { and, eq, asc, count } from 'drizzle-orm'
import * as schemas from '../../db/schema.ts'
import { defineHandlers, ensure, getPagingOptions, serializeTimestamps } from '../../lib/utils.ts'
import LessonSerializer from '../../serializers/LessonSerializer.ts'

const handlers = defineHandlers({
  async coursesLessonsIndex(request, reply) {
    const page = request.query?.page ?? 1
    const perPage = request.query?.perPage ?? 10
    const [{ total }] = await request.db
      .select({ total: count() })
      .from(schemas.courseLessons)
      .where(eq(schemas.courseLessons.courseId, request.params.courseId))
    const totalPages = Math.ceil(total / perPage)

    const lessons = await request.db.query.courseLessons.findMany({
      where: eq(schemas.courseLessons.courseId, request.params.courseId),
      orderBy: asc(schemas.courseLessons.id),
      ...getPagingOptions(page, perPage),
    })

    return reply.code(200).send(LessonSerializer.index(lessons.map(serializeTimestamps), {page, perPage, total, totalPages}))
  },

  async coursesLessonsShow(request, reply) {
    const lesson = await request.db.query.courseLessons.findFirst({
      where: and(
        eq(schemas.courseLessons.courseId, request.params.courseId),
        eq(schemas.courseLessons.id, request.params.id)
      )
    })
    ensure(lesson, 404)

    return reply.code(200).send(serializeTimestamps(lesson))
  },

  async coursesLessonsCreate(request, reply) {
    const values = {...request.body, courseId: request.params.courseId}
    const [lesson] = await request.db.insert(schemas.courseLessons)
      .values(values)
      .returning()

    return reply.code(201).send(serializeTimestamps(lesson))
  },

  async coursesLessonsDelete(request, reply) {
    const [lesson] = await request.db.delete(schemas.courseLessons)
      .where(
        and(
          eq(schemas.courseLessons.courseId, request.params.courseId),
          eq(schemas.courseLessons.id, request.params.id)
        )
      )
      .returning()
    ensure(lesson, 404)

    return reply.code(204).send()
  },
})

export default handlers