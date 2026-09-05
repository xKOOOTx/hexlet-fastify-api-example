import type { PageMeta, Lesson } from '../types/handlers/types.gen.ts'

export default class LessonSerializer {
    static index(lessons: Lesson[], meta: PageMeta) {
        return { data: lessons, meta }
    }
}