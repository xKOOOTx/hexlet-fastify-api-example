import { faker } from '@faker-js/faker'
import type { CourseInsert, CourseLessonInsert, UserInsert } from '../types/index.ts'

export function buildUser(params: Partial<UserInsert> = {}): UserInsert {
  return {
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
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