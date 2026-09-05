import * as assert from 'node:assert'
import { asc } from 'drizzle-orm'
import * as schemas from '../../../src/db/schema.ts'
import { createTest, getAuthHeader } from '../../helper.ts'
import { buildUserRecord } from '../../../src/lib/data.ts';


const test = createTest();

test('get courses', async ({ app }) => {
    const headers = getAuthHeader(app);
    const res = await app.inject({
        url: '/api/courses',
        headers
    })
    assert.equal(res.statusCode, 200, res.body)
})

test('get courses/:id', async ({ app }) => {
    const headers = getAuthHeader(app);
    const course = await app.db.query.courses.findFirst({ orderBy: asc(schemas.courses.id )})
    assert.ok(course)

    const res = await app.inject({
        url: `/api/courses/${course.id}`,
        headers
    })
    assert.equal(res.statusCode, 200, res.body)
})

test('update courses/:id happy path', async ({ app }) => {
    const headers = getAuthHeader(app)
    const courseRes = await app.inject({
        method: 'post',
        url: `/api/courses`,
        body: { name: 'Test course', description: 'Test description' },
        headers
    })
    const course = JSON.parse(courseRes.body)

    const res = await app.inject({
        method: 'patch',
        url: `/api/courses/${course.id}`,
        body: { name: 'Haked name' },
        headers
    })

    assert.equal(res.statusCode, 200, res.body)
})

test('update courses/:id forbidden', async ({ app }) => {
    const ownerHeaders = getAuthHeader(app)

    const courseRes = await app.inject({
        method: 'post',
        url: `/api/courses`,
        body: { name: 'Test course', description: 'Test description' },
        headers: ownerHeaders
    })
    const course = JSON.parse(courseRes.body)

    const [otherUser] = await app.db.insert(schemas.users).values(await buildUserRecord()).returning()
    const otherHeaders = { authorization: `Bearer ${app.jwt.sign({ id: otherUser.id })}` }

    const res = await app.inject({
        method: 'patch',
        url: `/api/courses/${course.id}`,
        body: { name: 'Haked name' },
        headers: otherHeaders
    })

    assert.equal(res.statusCode, 403, res.body)
    
})

test('update courses/:id not found', async ({ app }) => {
    const headers = getAuthHeader(app)

    const res = await app.inject({
        method: 'patch',
        url: '/api/courses/99999999',
        body: { name: 'Not found' },
        headers
    })

    assert.equal(res.statusCode, 404, res.body)
})

test('post courses', async ({ app }) => {
    const headers = getAuthHeader(app);

    const res = await app.inject({
        method: 'post',
        url: '/api/courses',
        body: { name: 'Test course', description: 'Test description' },
        headers
    })
    assert.equal(res.statusCode, 201, res.body)
})

test('delete courses/:id happy path', async ({ app }) => {
    const headers = getAuthHeader(app);

    const courseRes = await app.inject({
        method: 'post',
        url: '/api/courses',
        body: { name: 'Test course', description: 'Test description' },
        headers
    })

    const course = JSON.parse(courseRes.body)

    const res = await app.inject({
        method: 'delete',
        url: `/api/courses/${course.id}`,
        headers
    })
    assert.equal(res.statusCode, 204, res.body)
})

test('delete courses/:id forbidden', async ({ app }) => {
    const ownerHeaders = getAuthHeader(app)
    const courseRes = await app.inject({
        method: 'post',
        url: '/api/courses',
        body: { name: 'Test course', description: 'Test description' },
        headers: ownerHeaders
    })

    const course = JSON.parse(courseRes.body)

    const [otherUser] = await app.db.insert(schemas.users).values(await buildUserRecord()).returning()
    const otherHeaders = { authorization: `Bearer ${app.jwt.sign({ id: otherUser.id })}` }

    const res = await app.inject({
        method: 'delete',
        url: `/api/courses/${course.id}`,
        headers: otherHeaders
    })

    assert.equal(res.statusCode, 403, res.body)
})

test('delete courses/:id not found', async ({ app }) => {
    const headers = getAuthHeader(app)

    const res = await app.inject({
        method: 'delete',
        url: '/api/courses/9999999',
        headers
    })

    assert.equal(res.statusCode, 404, res.body)
})

test('delete courses/:id removes its lessons', async ({ app }) => {
    const headers = getAuthHeader(app);

    const courseRes = await app.inject({
        method: 'post',
        url: '/api/courses',
        body: { name: 'Test course', description: 'Test description' },
        headers
    })
    const course = JSON.parse(courseRes.body);

    const lessonsRes = await app.inject({
        method: 'post',
        url: '/api/lessons',
        body: { name: 'Test lesson', courseId: course.id, body: 'Test body' },
        headers
    })
    const lesson = JSON.parse(lessonsRes.body);

    await app.inject({
        method: 'delete',
        url: `/api/courses/${course.id}`,
        headers
    })

    const res = await app.inject({
        url: `/api/lessons/${lesson.id}`,
        headers
    })
    assert.equal(res.statusCode, 404, res.body)
})

test('get courses returns data and meta', async ({ app }) => {
  const headers = getAuthHeader(app)

  const res = await app.inject({ url: '/api/courses', headers })
  assert.equal(res.statusCode, 200, res.body)

  const json = JSON.parse(res.body)
  assert.ok(Array.isArray(json.data))
  assert.ok(json.meta)
  assert.equal(typeof json.meta.total, 'number')
})