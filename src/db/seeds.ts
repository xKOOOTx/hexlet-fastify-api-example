import * as schemas from './schema.ts'
import { buildCourse, buildCourseLesson, buildUser } from '../lib/data.ts'
/**
 * @param {import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof schemas>} db
 */
export default async (db) => {
  const [user1] = await db.insert(schemas.users).values(buildUser()).returning()
  const [user2] = await db.insert(schemas.users).values(buildUser()).returning()
  const [course1] = await db.insert(schemas.courses).values(
    buildCourse({ creatorId: user2.id }),
  ).returning()
  const [course2] = await db.insert(schemas.courses).values(
    buildCourse({ creatorId: user2.id }),
  ).returning()

  await db.insert(schemas.courseLessons).values(
    buildCourseLesson({ courseId: course2.id }),
  )

  await db.insert(schemas.users).values({
    id: 3,
      fullName: 'some name',
      email: 'support@hexlet.io',
      updatedAt: '2026-08-29',
      createdAt: '2026-08-29',
  })
}