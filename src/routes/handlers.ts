import users from './api/users.ts'
import courses from './api/courses.ts'
import lessons from './api/lessons.ts'

export default { ...users , ...courses, ...lessons}