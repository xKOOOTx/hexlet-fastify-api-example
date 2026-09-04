import { eq, asc } from 'drizzle-orm'
import * as schemas from '../../db/schema.js'
import { schema } from '../../schema.js'

/**
  * @param {import('fastify').FastifyTypebox} fastify
  */

export default async function (fastify) {
  const db = fastify.db

    fastify.get(
        '/users',
        {
            schema: {
                querystring: schema['/users'].GET.args.properties.query,
            },
        },
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
        {
            schema: schema['/users/{id}'].GET.args.properties,
        },
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
        {
            schema: {
                body: schema['/users'].POST.args.properties.body,
                response: {
                201: schema['/users'].POST.data,
                },
            },
        },
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
        {
            // Возвращает { params: ... }
            schema: schema['/users/{id}'].DELETE.args.properties,
        },
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