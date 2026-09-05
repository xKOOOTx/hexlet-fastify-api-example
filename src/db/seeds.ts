import { buildCourse, buildCourseLesson, buildUserRecord } from '../lib/data.ts'
import type { DrizzleDB } from '../types/index.ts'
import * as schemas from './schema.ts'

export default async (db: DrizzleDB) => {
  await db.insert(schemas.users).values(await buildUserRecord())
  await db.insert(schemas.users).values(
    await buildUserRecord({
      email: 'support@hexlet.io',
      fullName: 'Тото Поддерживающий',
    }),
  )
  const [author] = await db.insert(schemas.users).values(await buildUserRecord()).returning()
  await db.insert(schemas.courses).values(buildCourse({ creatorId: author.id }))
  const [course] = await db
    .insert(schemas.courses)
    .values(buildCourse({ creatorId: author.id }))
    .returning()
  await db.insert(schemas.courseLessons).values(buildCourseLesson({ courseId: course.id }))
}