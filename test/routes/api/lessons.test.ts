import * as assert from 'node:assert'
import { asc } from 'drizzle-orm'
import * as schemas from '../../../src/db/schema.ts'
import { createTest, getAuthHeader } from '../../helper.ts'

const test = createTest();

test('get lessons', async ({ app }) => {
    const headers = getAuthHeader(app);
    const res = await app.inject({
        url: '/api/lessons',
        headers
    })
    assert.equal(res.statusCode, 200, res.body)
})

test('get lessons/:id', async ({ app }) => {
    const headers = getAuthHeader(app);
    const lesson = await app.db.query.courseLessons.findFirst({ orderBy: asc(schemas.courseLessons.id) })
    assert.ok(lesson)

    const res = await app.inject({
        url: `/api/lessons/${lesson.id}`,
        headers
    })
    assert.equal(res.statusCode, 200, res.body)
})

test('post lessons', async ({ app }) => {
    const headers = getAuthHeader(app);
    const course = await app.db.query.courses.findFirst({ orderBy: asc(schemas.courses.id) })
    assert.ok(course)
    
    const res = await app.inject({
        method: 'post',
        url: '/api/lessons',
        body: { name: 'Test lesson', courseId: course.id, body: 'Test body' },
        headers
    })

    assert.equal(res.statusCode, 201, res.body)
})

test('delete lessons/:id', async ({ app }) => {
    const headers = getAuthHeader(app);
    const lesson = await app.db.query.courseLessons.findFirst({ orderBy: asc(schemas.courseLessons.id) })
    assert.ok(lesson)

    const res = await app.inject({
        method: 'delete',
        url: `/api/lessons/${lesson.id}`,
        headers
    })

    assert.equal(res.statusCode, 204, res.body)
})
