import { eq, asc, count } from 'drizzle-orm'
import * as schemas from '../../db/schema.ts'
import { defineHandlers, ensure, getPagingOptions, serializeTimestamps } from '../../lib/utils.ts';
import { httpErrors } from '@fastify/sensible';
import CoursePolicy from '../../policies/CoursePolicy.ts';
import CourseSerializer from '../../serializers/CourseSerializer.ts';

const handlers = defineHandlers({
  async coursesIndex(request, reply) {
    const page = request.query?.page ?? 1
    const perPage = request.query?.perPage ?? 10
    const [{ total }] = await request.db.select({ total: count() }).from(schemas.courses)
    const totalPages = Math.ceil(total / perPage)

    const courses = await request.db.query.courses.findMany({
      orderBy: asc(schemas.courses.id),
      ...getPagingOptions(page, perPage),
    })

    return reply.code(200).send(CourseSerializer.index(courses.map(serializeTimestamps), {page, perPage, total, totalPages}))
  },

  async coursesShow(request, reply) {
    const course = await request.db.query.courses.findFirst({
      where: eq(schemas.courses.id, request.params.id),
    })
    ensure(course, 404)

    return reply.code(200).send(serializeTimestamps(course))
  },

  async courseUpdate(request, reply) {
    const course = await request.db.query.courses.findFirst({
      where: eq(schemas.courses.id, request.params.id)
    })
    ensure(course, 404)

    if (!CoursePolicy.canUpdate(course, request.user.id)) {
      throw httpErrors.forbidden();
    }

    const [updated] = await request.db
      .update(schemas.courses)
      .set(request.body)
      .where(eq(schemas.courses.id, request.params.id))
      .returning()

      return reply.code(200).send(serializeTimestamps(updated))
  },

  async coursesCreate(request, reply) {
    const [course] = await request.db.insert(schemas.courses)
      .values({ ...request.body, creatorId: request.user.id })
      .returning()

    return reply.code(201).send(serializeTimestamps(course))
  },

  async coursesDelete(request, reply) {
    const foundCourse = await request.db.query.courses.findFirst({
      where: eq(schemas.courses.id, request.params.id)
    })

    ensure(foundCourse, 404)

    if (!CoursePolicy.canDelete(foundCourse, request.user.id)) {
      throw httpErrors.forbidden()
    }

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
