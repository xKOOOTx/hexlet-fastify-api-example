import * as assert from 'node:assert'
import { asc } from 'drizzle-orm'
import * as schemas from '../../../src/db/schema.ts'
import { createTest, getAuthHeader } from '../../helper.ts'


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

test('delete courses/:id', async ({ app }) => {
    const headers = getAuthHeader(app);
    const course = await app.db.query.courses.findFirst({ orderBy: asc(schemas.courses.id) })
    assert.ok(course)

    const res = await app.inject({
        method: 'delete',
        url: `/api/courses/${course.id}`,
        headers
    })
    assert.equal(res.statusCode, 204, res.body)
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
