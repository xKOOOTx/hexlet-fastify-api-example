import users from './api/users.ts'
import courses from './api/courses.ts'
import lessons from './api/lessons.ts'
import tokens from './api/tokens.ts'

export default { ...users, ...courses, ...lessons, ...tokens }