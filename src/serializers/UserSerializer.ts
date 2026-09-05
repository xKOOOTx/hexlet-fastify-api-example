import type { PageMeta, User } from '../types/handlers/types.gen.ts'

export default class UserSerializer {
    static index(users: User[], meta: PageMeta) {
        return { data: users, meta }
    }
}