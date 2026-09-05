import { eq } from 'drizzle-orm'
import { httpErrors } from '@fastify/sensible'
import { defineHandlers } from '../../lib/utils.ts'
import * as schemas from '../../db/schema.ts'
import { verifyPassword } from '../../lib/password.ts'

const handlers = defineHandlers({
  async tokensCreate(request, reply) {
    const user = await request.db.query.users.findFirst({
      where: eq(schemas.users.email, request.body.email),
    })
    if (!user || !(await verifyPassword(request.body.password, user.passwordDigest))) {
      throw httpErrors.notFound()
    }

    const token = request.server.jwt.sign({ id: user.id }, { expiresIn: '1h' })

    return reply.code(201).send({ token })
  },
})

export default handlers