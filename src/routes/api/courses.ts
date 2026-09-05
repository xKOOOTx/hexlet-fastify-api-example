import { eq, asc } from 'drizzle-orm'
import * as schemas from '../../db/schema.ts'
import { defineHandlers, ensure, getPagingOptions, serializeTimestamps } from '../../lib/utils.ts';

const handlers = defineHandlers({
  async coursesIndex(request, reply) {
    const page = request.query?.page ?? 1
    const courses = await request.db.query.courses.findMany({
      orderBy: asc(schemas.courses.id),
      ...getPagingOptions(page, 1),
    })

    return reply.code(200).send({ data: courses.map(serializeTimestamps) })
  },

  async coursesShow(request, reply) {
    const course = await request.db.query.courses.findFirst({
      where: eq(schemas.courses.id, request.params.id),
    })
    ensure(course, 404)

    return reply.code(200).send(serializeTimestamps(course))
  },

  async coursesCreate(request, reply) {
    const [course] = await request.db.insert(schemas.courses)
      .values({ ...request.body, creatorId: request.user.id })
      .returning()

    return reply.code(201).send(serializeTimestamps(course))
  },

  async coursesDelete(request, reply) {
    const [course] = await request.db.transaction(async (tx) => {
      await tx.delete(schemas.courseLessons)
        .where(eq(schemas.courseLessons.courseId, request.params.id))

      return tx.delete(schemas.courses)
        .where(eq(schemas.courses.id, request.params.id))
        .returning()
    })

    ensure(course, 404)

    return reply.code(204).send()
  },
})

export default handlers
