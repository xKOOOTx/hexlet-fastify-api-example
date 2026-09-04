import { test } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../../helper.js'
import { buildUser } from '../../../src/lib/data.ts'
import { getAuthHeader } from '../../helper.js'

test('get users', async (t) => {
  const app = await build(t)
  const headers = await getAuthHeader(app)

  const res = await app.inject({
    url: '/api/users',
    headers,
  })
  assert.equal(res.statusCode, 200, res.body)
})

test('get users/:id', async (t) => {
  const app = await build(t)

  const user = await app.db.query.users.findFirst()
  assert.ok(user)

  const res = await app.inject({
    url: `/api/users/${user.id}`,
  })
  assert.equal(res.statusCode, 200, res.body)
})

test('post users', async (t) => {
  const app = await build(t)
  const body = buildUser()

  const res = await app.inject({
    method: 'post',
    url: `/api/users`,
    body: body,
  })
  assert.equal(res.statusCode, 201, res.body)
})

// такого метода нет
// test('patch users/:id', async (t) => {
//   const app = await build(t)

//   const user = await app.db.query.users.findFirst()
//   assert.ok(user)

//   const res = await app.inject({
//     method: 'patch',
//     url: `/api/users/${user.id}`,
//     body: buildUser(),
//   })
//   assert.equal(res.statusCode, 200, res.body)
// })

test('delete users/:id', async (t) => {
  const app = await build(t)

  const user = await app.db.query.users.findFirst()
  assert.ok(user)

  const res = await app.inject({
    method: 'delete',
    url: `/api/users/${user.id}`,
  })

  assert.equal(res.statusCode, 204, res.body)
})