import * as assert from 'node:assert'
import { asc } from 'drizzle-orm'
import { buildUser } from '../../../src/lib/data.ts'
import * as schemas from '../../../src/db/schema.ts'
import { createTest, getAuthHeader } from '../../helper.ts'

const test = createTest()

test('get users', async ({ app }) => {
  const headers = getAuthHeader(app)

  const res = await app.inject({
    url: '/api/users',
    headers,
  })
  assert.equal(res.statusCode, 200, res.body)
})

test('get users/:id', async ({ app }) => {
  const headers = getAuthHeader(app)
  const user = await app.db.query.users.findFirst({ orderBy: asc(schemas.users.id) })
  assert.ok(user)

  const res = await app.inject({
    url: `/api/users/${user.id}`,
    headers
  })
  assert.equal(res.statusCode, 200, res.body)
})

test('post users', async ({ app }) => {
  const body = buildUser()

  const res = await app.inject({
    method: 'post',
    url: '/api/users',
    body,
  })
  assert.equal(res.statusCode, 201, res.body)
})

test('delete users/:id', async ({ app }) => {
  const headers = getAuthHeader(app)
  const user = await app.db.query.users.findFirst({ orderBy: asc(schemas.users.id) })
  assert.ok(user)

  const res = await app.inject({
    method: 'delete',
    url: `/api/users/${user.id}`,
    headers
  })
  assert.equal(res.statusCode, 204, res.body)
})