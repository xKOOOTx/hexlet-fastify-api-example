import type { drizzle } from 'drizzle-orm/node-postgres'
import type * as schemas from '../db/schema.ts'

export type DrizzleDB = ReturnType<typeof drizzle<typeof schemas>>

export type UserInsert = typeof schemas.users.$inferInsert
export type CourseInsert = typeof schemas.courses.$inferInsert
export type CourseLessonInsert = typeof schemas.courseLessons.$inferInsert