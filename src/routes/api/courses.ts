import { eq, asc } from 'drizzle-orm'
import * as schemas from '../../db/schema.js'

export default async function (fastify) {
  const db = fastify.db

    fastify.get(
        '/courses',
            async function (request) {
                const perPage = 1
                const { page } = request.query;
                const courses = await db.query
                    .courses
                    .findMany({
                        orderBy: asc(schemas.courses.id),
                        limit: perPage, // количество записей на страницу
                        offset: (page - 1) * perPage, // текущая страница
                    })

                return courses
            },
    );

    fastify.get(
        '/courses/:id',
            async (request) => {
                const user = await db.query.courses.findFirst({
                    where: eq(schemas.courses.id, request.params.id),
                })
                fastify.assert(course, 404)
                return course
            },
    );

    fastify.post(
        '/courses',
            async (request, reply) => {
                const [course] = await db.insert(schemas.courses)
                .values(request.body)
                .returning()

                return reply.code(201)
                .send(course)
            },
    );

    fastify.delete(
        '/courses/:id',
            async (request, reply) => {
                const [course] = await db.delete(schemas.courses)
                .where(eq(schemas.courses.id, request.params.id))
                .returning()
                fastify.assert(course, 404)
                // Обязательно вызывать send(), иначе обработка зависнет
                return reply.code(204).send()
            },
    )
}