import { eq, asc } from 'drizzle-orm'
import * as schemas from '../../db/schema.js'

export default async function (fastify) {
  const db = fastify.db

    fastify.get(
        '/lessons',
            async function (request) {
                const perPage = 1
                const { page } = request.query;
                const lessons = await db.query
                    .courseLessons
                    .findMany({
                        orderBy: asc(schemas.courseLessons.id),
                        limit: perPage, // количество записей на страницу
                        offset: (page - 1) * perPage, // текущая страница
                    })

                return lessons
            },
    );

    fastify.get(
        '/lessons/:id',
            async (request) => {
                const lesson = await db.query.courseLessons.findFirst({
                    where: eq(schemas.courseLessons.id, request.params.id),
                })
                fastify.assert(lesson, 404)
                return lesson
            },
    );

    fastify.post(
        '/lessons',
            async (request, reply) => {
                const [lesson] = await db.insert(schemas.courseLessons)
                .values(request.body)
                .returning()

                return reply.code(201)
                .send(lesson)
            },
    );

    fastify.delete(
        '/lessons/:id',
            async (request, reply) => {
                const [lesson] = await db.delete(schemas.courseLessons)
                .where(eq(schemas.courseLessons.id, request.params.id))
                .returning()
                fastify.assert(lesson, 404)
                // Обязательно вызывать send(), иначе обработка зависнет
                return reply.code(204).send()
            },
    )
}