import * as assert from 'node:assert'
import { asc } from 'drizzle-orm'
import { buildUser, buildUserRecord } from '../../../src/lib/data.ts'
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

test('post users email already taken', async ({ app }) => {
  const first = buildUser()
  await app.inject({
    method: 'post',
    url: '/api/users',
    body: first
  })

  const duplicate = buildUser({ email: first.email})
  const res = await app.inject({
    method: 'post',
    url: '/api/users',
    body: duplicate
  })

  assert.equal(res.statusCode, 422, res.body)

})

test('post users email already taken (different case)', async ({ app }) => {
  const first = buildUser()

  await app.inject({
    method: 'post',
    url: '/api/users',
    body: first
  })

  const duplicate = buildUser({ email: first.email.toUpperCase() })
  const res = await app.inject({
    method: 'post',
    url: '/api/users',
    body: duplicate
  })

  assert.equal(res.statusCode, 422, res.body)
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

test('delete user with courses returns 409', async ({ app }) => {
    const [user] = await app.db.insert(schemas.users).values(await buildUserRecord()).returning()
    const headers = { authorization: `Bearer ${app.jwt.sign({ id: user.id })}` }

    await app.inject({
      method: 'post',
      url: '/api/courses',
      body: { name: 'Test course', description: 'Test description' },
      headers
    })

    const res = await app.inject({
      method: 'delete',
      url: `/api/users/${user.id}`,
      headers
    })

    assert.equal(res.statusCode, 409, res.body)
})