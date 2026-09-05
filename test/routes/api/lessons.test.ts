import * as assert from 'node:assert'
import { asc } from 'drizzle-orm'
import * as schemas from '../../../src/db/schema.ts'
import { createTest, getAuthHeader } from '../../helper.ts'

const test = createTest()

async function createCourse(app, headers) {
  const res = await app.inject({
    method: 'post',
    url: '/api/courses',
    body: { name: 'Test course', description: 'Test description' },
    headers,
  })
  return JSON.parse(res.body)
}

async function createLesson(app, courseId, headers) {
  const res = await app.inject({
    method: 'post',
    url: `/api/courses/${courseId}/lessons`,
    body: { name: 'Test lesson', body: 'Test body' },
    headers,
  })
  return JSON.parse(res.body)
}

test('get courses/:courseId/lessons', async ({ app }) => {
  const headers = getAuthHeader(app)
  const course = await createCourse(app, headers)
  await createLesson(app, course.id, headers)

  const res = await app.inject({ url: `/api/courses/${course.id}/lessons`, headers })
  assert.equal(res.statusCode, 200, res.body)
})

test('get courses/:courseId/lessons returns only this course lessons', async ({ app }) => {
  const headers = getAuthHeader(app)
  const courseA = await createCourse(app, headers)
  const courseB = await createCourse(app, headers)
  await createLesson(app, courseA.id, headers)
  await createLesson(app, courseB.id, headers)

  const res = await app.inject({ url: `/api/courses/${courseA.id}/lessons`, headers })
  const json = JSON.parse(res.body)

  assert.ok(json.data.every((lesson) => lesson.courseId === courseA.id))
})

test('get courses/:courseId/lessons/:id wrong course returns 404', async ({ app }) => {
  const headers = getAuthHeader(app)
  const courseA = await createCourse(app, headers)
  const courseB = await createCourse(app, headers)
  const lesson = await createLesson(app, courseA.id, headers)

  const res = await app.inject({ url: `/api/courses/${courseB.id}/lessons/${lesson.id}`, headers })
  assert.equal(res.statusCode, 404, res.body)
})

test('post courses/:courseId/lessons ignores courseId in body', async ({ app }) => {
  const headers = getAuthHeader(app)
  const course = await createCourse(app, headers)
  const otherCourse = await createCourse(app, headers)

  const res = await app.inject({
    method: 'post',
    url: `/api/courses/${course.id}/lessons`,
    body: { name: 'Test lesson', body: 'Test body', courseId: otherCourse.id },
    headers,
  })

  assert.equal(res.statusCode, 201, res.body)
  const json = JSON.parse(res.body)
  assert.equal(json.courseId, course.id)
})

test('delete courses/:courseId/lessons/:id wrong course returns 404', async ({ app }) => {
  const headers = getAuthHeader(app)
  const courseA = await createCourse(app, headers)
  const courseB = await createCourse(app, headers)
  const lesson = await createLesson(app, courseA.id, headers)

  const res = await app.inject({
    method: 'delete',
    url: `/api/courses/${courseB.id}/lessons/${lesson.id}`,
    headers,
  })

  assert.equal(res.statusCode, 404, res.body)
})

test('delete courses/:courseId/lessons/:id', async ({ app }) => {
  const headers = getAuthHeader(app)
  const course = await createCourse(app, headers)
  const lesson = await createLesson(app, course.id, headers)

  const res = await app.inject({
    method: 'delete',
    url: `/api/courses/${course.id}/lessons/${lesson.id}`,
    headers,
  })

  assert.equal(res.statusCode, 204, res.body)
})