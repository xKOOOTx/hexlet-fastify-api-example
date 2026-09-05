import { faker } from '@faker-js/faker'
import { hashPassword } from './password.ts'
import type { CourseInsert, CourseLessonInsert, UserCreate, UserInsert } from '../types/index.ts'

export const DEFAULT_PASSWORD = 'correct-horse-battery-staple'

export function buildUser(params: Partial<UserCreate> = {}): UserCreate {
  return {
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    password: DEFAULT_PASSWORD,
    ...params,
  }
}

export async function buildUserRecord(params: Partial<UserInsert> = {}): Promise<UserInsert> {
  const { password, ...rest } = buildUser()

  return {
    ...rest,
    passwordDigest: await hashPassword(password),
    ...params,
  }
}

export function buildCourse(params: Partial<CourseInsert> & { creatorId: number }): CourseInsert {
  return {
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    ...params,
  }
}

export function buildCourseLesson(
  params: Partial<CourseLessonInsert> & { courseId: number },
): CourseLessonInsert {
  return {
    name: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    ...params,
  }
}