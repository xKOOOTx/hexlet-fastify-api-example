import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}

const id = integer('id').primaryKey().generatedByDefaultAsIdentity()

export const users = pgTable('users', {
  id,
  fullName: text('full_name'),
  email: text('email').notNull().unique(),
  ...timestamps,
})

export const courses = pgTable('courses', {
  id,
  name: text('name').notNull(),
  creatorId: integer('creator_id')
    .references(() => users.id, { onDelete: 'restrict' })
    .notNull(),
  description: text('description').notNull(),
  ...timestamps,
})

export const courseLessons = pgTable('course_lessons', {
  id,
  name: text('name').notNull(),
  courseId: integer('course_id')
    .references(() => courses.id, { onDelete: 'restrict' })
    .notNull(),
  body: text('body').notNull(),
  ...timestamps,
})