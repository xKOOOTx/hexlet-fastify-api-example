import { eq, asc } from 'drizzle-orm'
import * as schemas from '../../db/schema.js'

export default async function (fastify) {
  const db = fastify.db

    fastify.get(
        '/users',
            async function (request) {
                const perPage = 1
                const { page } = request.query;
                const users = await db.query
                    .users
                    .findMany({
                        orderBy: asc(schemas.users.id),
                        limit: perPage, // количество записей на страницу
                        offset: (page - 1) * perPage, // текущая страница
                    })

                return users
            },
    );

    fastify.get(
        '/users/:id',
            async (request) => {
                const user = await db.query.users.findFirst({
                    where: eq(schemas.users.id, request.params.id),
                })
                fastify.assert(user, 404)
                return user
            },
    );

    fastify.post(
        '/users',
            async (request, reply) => {
                const [user] = await db.insert(schemas.users)
                .values(request.body)
                .returning()

                return reply.code(201)
                .send(user)
            },
    );

    fastify.delete(
        '/users/:id',
            async (request, reply) => {
                const [user] = await db.delete(schemas.users)
                .where(eq(schemas.users.id, request.params.id))
                .returning()
                fastify.assert(user, 404)
                // Обязательно вызывать send(), иначе обработка зависнет
                return reply.code(204).send()
            },
    )
}