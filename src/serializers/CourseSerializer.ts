import type { PageMeta, Course } from '../types/handlers/types.gen.ts'

export default class CourseSerializer {
    static index(courses: Course[], meta: PageMeta) {
        return { data: courses, meta }
    }
}