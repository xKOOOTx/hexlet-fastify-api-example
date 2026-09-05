import type { Course } from '../types/index.ts'

export default class CoursePolicy {
    static canUpdate(course: Course, userId: number) {
        return course.creatorId === userId;
    }

    static canDelete(course: Course, userId: number) {
        return course.creatorId === userId;
    }
}